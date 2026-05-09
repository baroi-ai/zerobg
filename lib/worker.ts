import { pipeline, env, RawImage } from "@huggingface/transformers";

// Optional: Force browser caching so it works offline after the first run
env.allowLocalModels = false;
try {
  if (typeof caches !== "undefined") env.useBrowserCache = true;
} catch {
  console.warn("Cache API disabled.");
}

let segmenter: Awaited<ReturnType<typeof pipeline>> | null = null;

self.onmessage = async (event: MessageEvent) => {
  const { action, imageBlob } = event.data;

  if (action === "process" && imageBlob) {
    try {
      self.postMessage({ status: "progress", message: "Loading AI Model..." });

      // Load model if not already loaded
      if (!segmenter) {
        segmenter = await pipeline("image-segmentation", "Xenova/modnet", {
          device: "wasm",
          progress_callback: (data: { status: string; progress?: number }) => {
            if (data.status === "progress" && data.progress !== undefined) {
              self.postMessage({
                status: "progress",
                message: `Downloading Model: ${Math.round(data.progress)}%`,
              });
            }
          },
        });
      }

      self.postMessage({ status: "progress", message: "Analyzing Image..." });

      // Convert Blob to RawImage for Transformers.js
      const image = await RawImage.fromBlob(imageBlob);
      
      // FIX: Replaced 'Function' with a specific function signature 
      // telling TS exactly what arguments it takes and what it returns.
      const runSegmenter = segmenter as (input: RawImage) => Promise<unknown>;
      const output: unknown = await runSegmenter(image);
      
      // Safely access the mask depending on how Transformers.js returns it
      const mask = Array.isArray(output) 
        ? (output[0] as { mask: RawImage }).mask 
        : (output as { mask: RawImage }).mask || (output as RawImage);

      self.postMessage({ status: "progress", message: "Removing Background..." });

      // Apply the AI mask to the original image using OffscreenCanvas
      const canvas = new OffscreenCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d")!;
      const originalBitmap = await createImageBitmap(imageBlob);
      
      ctx.drawImage(originalBitmap, 0, 0);
      const pixelData = ctx.getImageData(0, 0, image.width, image.height);

      for (let i = 0; i < mask.data.length; i++) {
        // Set the Alpha channel (transparency) based on the AI mask
        pixelData.data[i * 4 + 3] = mask.data[i];
      }
      
      ctx.putImageData(pixelData, 0, 0);
      
      // Convert back to a PNG blob
      const resultBlob = await canvas.convertToBlob({ type: "image/png" });
      
      self.postMessage({ status: "success", blob: resultBlob });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      self.postMessage({ status: "error", error: errorMessage });
    }
  }
};
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Loader2,
  Download,
  UploadCloud,
  ImageOff,
  XCircle,
  Eraser,
  Brush,
  Undo,
  Coins,
  ZoomIn,
  ZoomOut,
  Cpu,
  Sparkles,
  Zap,
  Menu,
  Image as ImageIcon,
  Heart,
  User,
  Info,
  LifeBuoy,
  Redo
} from "lucide-react";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import SplashScreen from "@/components/SplashScreen";

// --- Types ---
type ToolType = "none" | "erase" | "restore";

interface GenerationJob {
  id: string;
  status: "processing" | "completed" | "failed";
  urls: string[];
  originalUrl: string;
}

export default function Home() {
  // --- State ---
  const [statusText, setStatusText] = useState("Upload");

  // File & Preview
  const [sourceImageFile, setSourceImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  

  // Job & AI State
  const [activeJob, setActiveJob] = useState<GenerationJob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progressText, setProgressText] = useState("Processing...");

  // Model Selector State
  const [aiModel, setAiModel] = useState<"briaai/RMBG-1.4" | "Xenova/modnet">(
    "briaai/RMBG-1.4"
  );

  // Editor / Canvas State
  const [tool, setTool] = useState<ToolType>("restore");
  const [brushSize, setBrushSize] = useState(30);
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  // Zoom State
  const [zoom, setZoom] = useState(1);
  const [imageDimensions, setImageDimensions] = useState<{
    w: number;
    h: number;
  } | null>(null);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const progressRef = useRef<string>("Initializing...");

  // --- MEMORY MANAGEMENT HELPER ---
  const revokeUrl = (url: string | null) => {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  };

  const [redoHistory, setRedoHistory] = useState<ImageData[]>([]);

  // --- Canvas Drawing Logic ---
  const initializeCanvas = (url: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.src = url;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      setImageDimensions({ w: img.width, h: img.height });

      if (containerRef.current) {
        const containerW = containerRef.current.clientWidth - 40;
        const containerH = containerRef.current.clientHeight - 40;
        const scaleW = containerW / img.width;
        const scaleH = containerH / img.height;
        const initialZoom = Math.min(scaleW, scaleH, 1);
        setZoom(initialZoom);
      } else {
        setZoom(1);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    };
  };

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    setHistory((prev) => {
      const newHistory = [
        ...prev,
        ctx.getImageData(0, 0, canvas.width, canvas.height),
      ];
      if (newHistory.length > 10) newHistory.shift();
      return newHistory;
    });
    
    // ADD THIS LINE: Clear the redo stack whenever a new action happens
    setRedoHistory([]); 
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const newHistory = [...history];
    const undoneState = newHistory.pop(); // Grab the state we are undoing
    const previousState = newHistory[newHistory.length - 1];

    if (previousState && undoneState) {
      ctx.putImageData(previousState, 0, 0);
      setHistory(newHistory);
      // Push the undone state to the redo stack
      setRedoHistory((prev) => [...prev, undoneState]); 
    }
  };

  const handleRedo = () => {
    if (redoHistory.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const newRedoHistory = [...redoHistory];
    const stateToRestore = newRedoHistory.pop(); // Grab the last undone state

    if (stateToRestore) {
      ctx.putImageData(stateToRestore, 0, 0);
      setRedoHistory(newRedoHistory);
      setHistory((prev) => [...prev, stateToRestore]);
    }
  };

  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (
      !isDragging ||
      tool === "none" ||
      !canvasRef.current ||
      !lastPosRef.current
    )
      return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const currentPos = getPointerPos(e);

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (tool === "erase") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
    } else if (tool === "restore" && originalImageRef.current) {
      ctx.globalCompositeOperation = "source-over";
      const pattern = ctx.createPattern(originalImageRef.current, "no-repeat");
      if (pattern) ctx.strokeStyle = pattern;
    }

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.stroke();

    lastPosRef.current = currentPos;
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (tool === "none") return;
    setIsDragging(true);
    const pos = getPointerPos(e);
    lastPosRef.current = pos;

    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && lastPosRef.current) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDragging) {
      setIsDragging(false);
      lastPosRef.current = null;
      saveHistory();
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "ZeroBG-Edited.png");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // --- Effects ---
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../lib/worker.ts", import.meta.url),
      { type: "module" }
    );

    workerRef.current.onmessage = (event) => {
      const { status, blob, error, percent, key } = event.data;

      if (status === "progress") {
        progressRef.current = `${key || "Processing..."} ${percent || ""}%`;
        setProgressText(`${key || "Processing..."} ${percent || ""}%`);
      } else if (status === "success") {
        const generatedUrl = URL.createObjectURL(blob);

        setActiveJob((prev) => {
          if (prev && prev.urls[0]) revokeUrl(prev.urls[0]);
          return { ...prev!, status: "completed", urls: [generatedUrl] };
        });

        setIsLoading(false);
      } else if (status === "error") {
        console.error(error);
        setActiveJob((prev) => (prev ? { ...prev, status: "failed" } : null));
        setIsLoading(false);
        alert("Failed to process image.");
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (activeJob?.status === "completed" && activeJob.urls[0]) {
      const timer = setTimeout(() => {
        initializeCanvas(activeJob.urls[0]);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activeJob]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setProgressText((prev) => {
          if (prev !== progressRef.current) return progressRef.current;
          return prev;
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // --- Logic ---
  const toggleTool = (selectedTool: ToolType) => {
    setTool((currentTool) =>
      currentTool === selectedTool ? "none" : selectedTool
    );
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert("File size cannot exceed 15MB for browser processing.");
        return;
      }

      revokeUrl(imagePreviewUrl);
      if (activeJob?.urls[0]) revokeUrl(activeJob.urls[0]);

      setSourceImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);

      const img = new Image();
      img.src = url;
      originalImageRef.current = img;

      setActiveJob(null);
      setHistory([]);
      setTool("restore");
      setZoom(1);
      setImageDimensions(null);
      e.target.value = "";
    }
  };

  // Dropdown State
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearImage = () => {
    revokeUrl(imagePreviewUrl);
    if (activeJob?.urls[0]) revokeUrl(activeJob.urls[0]);

    setSourceImageFile(null);
    setImagePreviewUrl(null);
    setActiveJob(null);
    setHistory([]);
    setZoom(1);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGenerate = async () => {
    if (!sourceImageFile || !imagePreviewUrl) {
      alert("Please upload an image.");
      return;
    }

    if (!workerRef.current) {
      alert("Worker not initialized. Please refresh.");
      return;
    }

    setIsLoading(true);
    progressRef.current = "Starting...";

    const newJobId = `job-${Date.now()}`;
    setActiveJob({
      id: newJobId,
      status: "processing",
      urls: [],
      originalUrl: imagePreviewUrl,
    });

    workerRef.current.postMessage({
      action: "process",
      imageBlob: sourceImageFile,
      modelName: aiModel,
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.shiftKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -5 : 5;
      setBrushSize((prev) => Math.min(Math.max(prev + delta, 5), 100));
      return;
    }

    if (e.ctrlKey || !isDragging) {
      const scaleAmount = -e.deltaY * 0.001;
      setZoom((prev) => Math.min(Math.max(prev + scaleAmount, 0.1), 5));
    }
  };

  return (
    <>
    <SplashScreen />
    <div className="flex flex-col h-screen bg-slate-950 text-gray-300 relative overflow-hidden">
      
      {/* --- BACKGROUND GRADIENT GLOW --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      {/* --- TOP NAVBAR --- */}
      <Navbar />

      {/* --- MAIN PREVIEW AREA --- */}
      <div className="grow overflow-hidden relative flex items-center justify-center">
        <div
          ref={containerRef}
          className="w-full h-full overflow-auto flex items-center justify-center p-4 md:p-8"
        >
          {/* STATE 1: Empty */}
          {!activeJob && !imagePreviewUrl && (
            <div className="flex flex-col items-center justify-center gap-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex flex-col items-center justify-center text-center text-gray-600">
                <ImageOff className="h-16 w-16 mb-4 opacity-30" />
                <h2 className="text-xl md:text-2xl font-semibold mb-2 text-white">Upload an Image</h2>
                <p className="text-sm text-gray-500 max-w-[250px] md:max-w-md">
                  Select a photo from your gallery to remove the background instantly.
                </p>
              </div>
            </div>
          )}

          {/* STATE 2: Image Preview */}
          {!activeJob && imagePreviewUrl && (
            <div className="relative group w-fit h-auto shadow-2xl animate-in fade-in duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreviewUrl}
                alt="Source"
                className="max-h-[60vh] max-w-full w-auto object-contain rounded-lg"
              />
              <button
                onClick={clearImage}
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-slate-900/80 text-white flex items-center justify-center shadow-lg border border-white/10 hover:bg-red-600 transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* STATE 3: Processing */}
          {activeJob && activeJob.status === "processing" && (
            <div className="flex flex-col items-center justify-center p-8 md:p-12 bg-slate-900/50 rounded-2xl border border-white/5 animate-in pulse">
              <Loader2 className="h-10 w-10 animate-spin text-teal-500 mb-4" />
              <p className="text-lg font-medium text-white mb-1">
                ZeroBG is working...
              </p>
              <p className="text-sm text-teal-200/50">{progressText}</p>
            </div>
          )}

          {/* STATE 4: Interactive Canvas (Result) */}
          {activeJob && activeJob.status === "completed" && (
            <div
              className="relative shadow-2xl overflow-hidden rounded-lg transition-transform duration-75 ease-out border border-white/10"
              onWheel={handleWheel}
              style={{
                width: imageDimensions ? imageDimensions.w * zoom : "auto",
                height: imageDimensions ? imageDimensions.h * zoom : "auto",
                backgroundImage:
                  "repeating-conic-gradient(#1f2937 0% 25%, transparent 0% 50%)",
                backgroundSize: "20px 20px",
              }}
            >
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-full touch-none cursor-crosshair block"
              />
            </div>
          )}

          {/* STATE 5: Failed */}
          {activeJob && activeJob.status === "failed" && (
            <div className="p-6 bg-red-900/20 border border-red-500/20 rounded-xl text-center">
              <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-200 text-sm">Processing failed.</p>
              <button
                onClick={clearImage}
                className="mt-4 px-4 py-2 text-xs bg-red-500/20 text-red-300 hover:bg-red-500/30 transition rounded-md"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- INPUT BAR & BOTTOM TOOLBAR --- */}
      <div className="w-full px-4 pb-6 pt-2 bg-transparent backdrop-blur mb-10 z-10 shrink-0">
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto mb-2 gap-3">
          
          {/* Mobile-Friendly Editor Toolbar */}
          {activeJob?.status === "completed" && (
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 bg-slate-900/90 backdrop-blur-md p-2 md:p-2.5 rounded-xl border border-white/10 shadow-xl w-full">
              
              {/* Brush / Eraser Toggle */}
              <div className="flex items-center gap-1 bg-slate-950/50 p-1 rounded-lg">
                <button
                  onClick={() => toggleTool("restore")}
                  className={`h-8 px-3 rounded-md flex items-center text-xs font-medium transition-all ${
                    tool === "restore"
                      ? "bg-linear-to-r from-cyan-500 to-teal-500 text-white shadow-md"
                      : "text-gray-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Brush className="w-3.5 h-3.5 mr-1.5" /> Restore
                </button>
                <button
                  onClick={() => toggleTool("erase")}
                  className={`h-8 px-3 rounded-md flex items-center text-xs font-medium transition-all ${
                    tool === "erase"
                      ? "bg-red-600 text-white shadow-md hover:bg-red-700"
                      : "text-gray-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Eraser className="w-3.5 h-3.5 mr-1.5" /> Erase
                </button>
              </div>

              <div className="hidden sm:block w-px h-6 bg-white/10 mx-1"></div>

              {/* Brush Size Slider */}
              <div className="flex items-center gap-3 px-2 flex-grow min-w-[120px] max-w-[200px] bg-slate-950/30 h-10 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-gray-500 shrink-0"></div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="w-3 h-3 rounded-full bg-gray-400 shrink-0"></div>
              </div>

              <div className="hidden sm:block w-px h-6 bg-white/10 mx-1"></div>

              {/* Zoom & Undo Controls */}
              <div className="flex items-center gap-1 bg-slate-950/50 p-1 rounded-lg">
                <button
                  className="h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-slate-800 transition"
                  onClick={() => setZoom((z) => Math.max(0.1, z - 0.1))}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-mono w-9 text-center text-gray-400">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  className="h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-slate-800 transition"
                  onClick={() => setZoom((z) => Math.min(5, z + 0.1))}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-white/10 mx-1.5"></div>
                <button
                  className="h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  onClick={handleUndo}
                  disabled={history.length <= 1}
                >
                  <Undo className="w-4 h-4" />
                </button>
                <button
                  className="h-8 w-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  onClick={handleRedo}
                  disabled={redoHistory.length === 0}
                >
                  <Redo className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Input & Button Row Wrapper */}
          <div className="relative w-full max-w-4xl mx-auto flex flex-col gap-2 mt-2">
            
            {/* Model Selector */}
            {(!activeJob || activeJob.status === "failed") && (
              <div className="flex items-center gap-1 self-center bg-gray-900/80 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg z-20 mb-1">
                <button
                  onClick={() => setAiModel("briaai/RMBG-1.4")}
                  className={`h-8 flex items-center text-xs px-4 rounded-full transition-all duration-300 ${
                    aiModel === "briaai/RMBG-1.4"
                      ? "bg-linear-to-r from-cyan-500 to-teal-500 text-black font-bold shadow-md"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${aiModel === "briaai/RMBG-1.4" ? "text-black" : "text-teal-400"}`} />
                  HD
                </button>
                <button
                  onClick={() => setAiModel("Xenova/modnet")}
                  className={`h-8 flex items-center text-xs px-4 rounded-full transition-all duration-300 ${
                    aiModel === "Xenova/modnet"
                      ? "bg-linear-to-r from-cyan-500 to-teal-500 text-black font-bold shadow-md"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Zap className={`w-3.5 h-3.5 mr-1.5 ${aiModel === "Xenova/modnet" ? "text-black" : "text-teal-400"}`} />
                  Fast
                </button>
              </div>
            )}

            {/* Upload & Generate Row */}
            <div className="p-1.5 rounded-2xl flex items-start gap-2 md:gap-3">
              <div className="shrink-0 relative">
                <input
                  ref={fileInputRef}
                  id="source-image-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageFileChange}
                  className="hidden"
                  disabled={isLoading}
                />
                <label
                  htmlFor="source-image-upload"
                  className={`cursor-pointer h-12 w-12 md:h-14 md:w-14 flex flex-col items-center justify-center text-xs border bg-text-black hover:bg-slate-700 hover:border-cyan-500 hover:text-cyan-400 rounded-xl transition-all shadow-inner ${
                    imagePreviewUrl ? "border-cyan-500 text-cyan-500" : "border-slate-700 text-gray-400"
                  }`}
                >
                  <UploadCloud className="h-5 w-5 md:h-6 md:w-6" />
                </label>
              </div>

              <div className="grow relative flex items-center">
                <textarea
                  placeholder="Tap the upload button..."
                  value={statusText}
                  onChange={(e) => setStatusText(e.target.value)}
                  rows={1}
                  disabled={true}
                  className="grow border border-slate-800 rounded-xl resize-none text-sm md:text-base text-gray-400 pl-4 pr-32 py-3.5 md:py-4 self-center min-h-12 md:min-h-14 cursor-not-allowed outline-none select-none shadow-inner"
                />

                <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {activeJob?.status === "completed" && (
                    <button
                      onClick={handleDownload}
                      className="h-9 md:h-11 px-4 flex items-center rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-lg shadow-teal-900/50 transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4 mr-1.5" /> Save
                    </button>
                  )}

                  {(!activeJob || activeJob.status !== "completed") && (
                    <button
                      onClick={handleGenerate}
                      disabled={!sourceImageFile || isLoading}
                      className={`h-9 md:h-11 px-4 rounded-lg flex items-center justify-center gap-1.5 text-white text-xs font-bold transition-all shadow-lg active:scale-95 ${
                        !sourceImageFile || isLoading
                          ? "bg-slate-800 text-gray-500 cursor-not-allowed"
                          : "bg-linear-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 shadow-teal-900/50"
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-teal-500" />
                      ) : (
                        <>
                          <span>GO</span>
                          <Sparkles className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
       <BottomNav />
    </div>
    </> 
  );
}
"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Cpu, ShieldCheck, Zap, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-gray-300 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2"></div>
      </div>

      <Navbar />

      <main className="grow relative z-10 px-6 py-12 max-w-2xl mx-auto pb-32">
        <h1 className="text-4xl font-bold text-white mb-6">About <span className="text-cyan-400">ZeroBG</span></h1>
        
        <p className="text-lg leading-relaxed mb-8 text-gray-400">
          ZeroBG is a next-generation background removal tool designed with 
          <span className="text-white font-semibold"> privacy and speed</span> in mind. 
          Unlike traditional tools, ZeroBG processes everything directly on your device.
        </p>

        <div className="grid gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-3">
              <Cpu className="text-cyan-400 w-6 h-6" />
              <h3 className="text-white font-bold">Local Processing</h3>
            </div>
            <p className="text-sm text-gray-500">Your images never touch a server. We use WebAssembly and ONNX Runtime to run AI models in your browser.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-3">
              <ShieldCheck className="text-teal-400 w-6 h-6" />
              <h3 className="text-white font-bold">100% Private</h3>
            </div>
            <p className="text-sm text-gray-500">Since no data is uploaded, your personal photos remain yours and yours alone. Perfect for sensitive documents.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-3">
              <Zap className="text-yellow-400 w-6 h-6" />
              <h3 className="text-white font-bold">Zero Costs</h3>
            </div>
            <p className="text-sm text-gray-500">No subscriptions, no credits, no limits. Because you provide the hardware, the service is free forever.</p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { FileText, ShieldAlert, Scale, Ban, Zap } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-gray-300 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2"></div>
      </div>

      <Navbar />

      <main className="grow relative z-10 px-6 py-12 max-w-2xl mx-auto pb-32">
        <div className="flex items-center gap-4 mb-6">
          <FileText className="text-cyan-400 w-8 h-8" />
          <h1 className="text-4xl font-bold text-white">
            Terms of <span className="text-cyan-400">Service</span>
          </h1>
        </div>
        
        <p className="text-sm text-slate-500 mb-8 uppercase tracking-widest">
          Last Updated: May 2026
        </p>

        <div className="space-y-8 leading-relaxed text-gray-400">
          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Scale className="w-5 h-5 text-teal-400" /> 1. Acceptance of Terms
            </h2>
            <p>
              By accessing ZeroBG, a tool provided by Baroi AI, you agree to be bound by these terms. 
              If you do not agree, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" /> 2. Description of Service
            </h2>
            <p>
              ZeroBG provides AI-powered background removal. All processing is performed locally in 
              your browser using WebAssembly and ONNX Runtime. No images are uploaded to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Ban className="w-5 h-5 text-red-400" /> 3. User Conduct
            </h2>
            <p>
              You agree not to use ZeroBG for any illegal purposes or to process content that violates 
              any laws. Since processing is local, you are solely responsible for the content you process.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-yellow-400" /> 4. Disclaimer of Warranties
            </h2>
            <p>
              The service is provided "AS IS". Baroi AI makes no warranties regarding the accuracy 
              or reliability of the AI-generated results.
            </p>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Heart, Coffee, Coins } from "lucide-react";

export default function Donate() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-gray-300 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      <main className="grow relative z-10 px-6 py-12 max-w-xl mx-auto flex flex-col items-center justify-center pb-32 text-center">
        <div className="mb-6 animate-bounce">
            <Heart className="w-16 h-16 text-red-500 fill-red-500/20" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Support ZeroBG</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          ZeroBG is a solo project maintained by <span className="text-white font-semibold">Subhodeep Baroi</span>. 
          Your donations help cover domain costs and allow me to keep developing privacy-focused AI tools for everyone.
        </p>

        <a 
          href="https://ko-fi.com/baroi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-cyan-500 to-teal-500 rounded-2xl text-slate-950 font-bold text-lg shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-95"
        >
          <Coffee className="w-6 h-6" />
          Buy me a Coffee
        </a>

        <div className="mt-12 grid grid-cols-2 gap-4 w-full">
            <div className="p-4 rounded-xl bg-slate-900/30 border border-white/5">
                <p className="text-2xl font-bold text-white mb-1">$0</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-500">Ads Shown</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/30 border border-white/5">
                <p className="text-2xl font-bold text-white mb-1">100%</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-500">User Supported</p>
            </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
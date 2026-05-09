"use client";

import React, { useEffect, useState } from "react";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if splash was already shown in this session
    const hasShownSplash = sessionStorage.getItem("zerobg-splash-shown");

    if (!hasShownSplash) {
      // First time visiting / during this session
      setIsVisible(true);
      sessionStorage.setItem("zerobg-splash-shown", "true");

      // Start fading at 2 seconds
      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, 2000);

      // Completely remove from DOM at 2.7 seconds
      const removeTimer = setTimeout(() => {
        setIsVisible(false);
      }, 2700);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    } else {
      // Already shown, stay hidden
      setIsVisible(false);
    }
  }, []);

  // Prevent hydration mismatch and only render if it's the first visit
  if (!mounted || !isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-700 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Minimalist Logo Area */}
        <div className="relative h-24 w-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/zerobg/logo.png" 
            alt="ZeroBG Logo" 
            className="relative h-20 w-20 object-contain z-10"
          />
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <h1 className="text-5xl font-bold tracking-tighter">
            <span className="text-white">Zero</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">BG</span>
          </h1>
          <p className="text-slate-500 text-[9px] font-bold tracking-[0.5em] uppercase pl-2 opacity-60">
            Local AI Processing
          </p>
        </div>
      </div>
      
      {/* Bottom Section: Loading + Branding */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-10 w-full">
        <div className="flex gap-2">
          <div className="w-1 h-1 rounded-full bg-cyan-500 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1 h-1 rounded-full bg-cyan-500 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1 h-1 rounded-full bg-cyan-500 animate-bounce"></div>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[8px] text-slate-700 uppercase tracking-[0.6em] font-bold">Project By</span>
          <span className="text-xs font-bold tracking-[0.2em] text-white/90 uppercase">
            Baroi <span className="text-cyan-500">AI</span>
          </span>
        </div>
      </div>
    </div>
  );
}
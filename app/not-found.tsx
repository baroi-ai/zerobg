"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { ImageOff, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-gray-300 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>
      </div>

      <Navbar />

      <main className="grow relative z-10 px-6 py-12 flex flex-col items-center justify-center text-center pb-32">
        {/* Animated Icon */}
        <div className="relative mb-8 animate-in zoom-in duration-500">
          <div className="absolute inset-0 bg-teal-500/20 blur-3xl rounded-full animate-pulse"></div>
          <ImageOff className="w-24 h-24 text-teal-400 relative z-10 opacity-80" strokeWidth={1.5} />
        </div>

        {/* 404 Heading */}
        <h1 className="text-7xl font-bold tracking-tighter mb-2">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-teal-400">
            404
          </span>
        </h1>
        
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        
        <p className="text-gray-400 max-w-sm mb-10 leading-relaxed">
          Looks like this page's background was removed completely. The link you followed might be broken, or the page no longer exists.
        </p>

        {/* Return Home Button */}
        <Link 
          href="/"
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-cyan-500 to-teal-500 rounded-2xl text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-95"
        >
          <Home className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          Return To Home
        </Link>
      </main>

      <BottomNav />
    </div>
  );
}
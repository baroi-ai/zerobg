"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Heart, 
  Info, 
  MoreHorizontal, 
  FileText, 
  Shield, 
  Globe,
  ExternalLink 
} from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper to check if link is active
  const isActive = (path: string) => pathname === path;

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* --- DROP-UP MENU --- */}
      {isMoreOpen && (
        <div 
          ref={moreMenuRef}
          className="mx-4 mb-2 p-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-200"
        >
          <div className="flex flex-col gap-1">
            <Link 
              href="/zerobg/terms" 
              onClick={() => setIsMoreOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 active:bg-white/5 rounded-xl transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              Terms of Service
            </Link>
            <Link 
              href="/zerobg/privacy" 
              onClick={() => setIsMoreOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 active:bg-white/5 rounded-xl transition-colors"
            >
              <Shield className="w-4 h-4 text-slate-500" />
              Privacy Policy
            </Link>
            <a 
              href="https://baroi-ai.github.io/zerobg/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3 text-sm text-slate-300 active:bg-white/5 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-slate-500" />
                Official Website
              </div>
              <ExternalLink className="w-3 h-3 text-slate-600" />
            </a>
          </div>
        </div>
      )}

      {/* --- MAIN NAV BAR --- */}
      <div className="bg-slate-950/90 backdrop-blur-lg border-t border-white/10 px-6 py-3 pb-safe">
        <div className="flex items-center justify-between">
          <Link 
            href="/zerobg/" 
            className={`flex flex-col items-center gap-1 transition-colors ${isActive('/zerobg/') ? 'text-cyan-400' : 'text-slate-400'}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          <Link 
            href="/zerobg/donate" 
            className={`flex flex-col items-center gap-1 transition-colors ${isActive('/zerobg/donate') ? 'text-teal-400' : 'text-slate-400'}`}
          >
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-medium">Donate</span>
          </Link>

          <Link 
            href="/zerobg/about" 
            className={`flex flex-col items-center gap-1 transition-colors ${isActive('/zerobg/about') ? 'text-cyan-400' : 'text-slate-400'}`}
          >
            <Info className="w-5 h-5" />
            <span className="text-[10px] font-medium">About</span>
          </Link>

          <button 
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex flex-col items-center gap-1 transition-colors ${isMoreOpen ? 'text-white' : 'text-slate-400'}`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect, useRef } from "react";
import { User, Info, LifeBuoy, Heart, ImageIcon, HatGlasses, Handshake } from "lucide-react";
import Link from "next/link"; // ✅ Correct for navigation

export default function Navbar() {
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full h-14 md:h-16 bg-transparent backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 shrink-0">
      {/* Left: Logo */}
      <Link href="/zerobg/" className="flex items-center gap-3 group transition-opacity hover:opacity-90">
        <div className="h-8 w-8 rounded-lg bg-linear-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/zerobg/logo.png"
            alt="ZeroBG Logo"
            className="h-full w-full object-cover"
          />
        </div>
        <span className="text-xl font-bold tracking-tight">
          <span className="text-white">Zero</span>
          <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-teal-400">
            BG
          </span>
        </span>
      </Link>

      {/* Right: User Avatar & Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownMenuOpen(!isDropdownMenuOpen)}
          className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-500 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        >
          <User className="h-5 w-5" />
        </button>

        {isDropdownMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
            <a
              href="/zerobg/about"
              onClick={() => setIsDropdownMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Info className="w-4 h-4 text-slate-400" />
              About
            </a>
            <a
              href="/zerobg/support"
              onClick={() => setIsDropdownMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <LifeBuoy className="w-4 h-4 text-slate-400" />
              Support
            </a>

            <a
              href="/zerobg/privacy"
              onClick={() => setIsDropdownMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <HatGlasses className="w-4 h-4 text-slate-400" />
              Privacy
            </a>

            <a
              href="/zerobg/terms"
              onClick={() => setIsDropdownMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Handshake className="w-4 h-4 text-slate-400" />
              Terms
            </a>

            <div className="h-px w-full bg-white/10 my-1"></div>

            <a
              href="/zerobg/donate"
              onClick={() => setIsDropdownMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 transition-colors"
            >
              <Heart className="w-4 h-4" />
              Donate
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
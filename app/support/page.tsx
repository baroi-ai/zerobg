"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { Mail, MessageSquare, Camera, Send, ExternalLink } from "lucide-react";

export default function Support() {
  const socials = [
    { 
      name: "Instagram", 
      icon: <Camera className="w-6 h-6" />, 
      link: "https://instagram.com/baroi.ai", 
      color: "hover:text-pink-500",
      username: "@baroi.ai"
    },
    { 
      name: "X (Twitter)", 
      icon: <Send className="w-6 h-6" />, 
      link: "https://x.com/baroi_ai", 
      color: "hover:text-blue-400",
      username: "@baroi_ai"
    },
    { 
      name: "Email", 
      icon: <Mail className="w-6 h-6" />, 
      link: "mailto:subhodeepbaroi2@gmail.com", 
      color: "hover:text-cyan-400",
      username: "subhodeepbaroi2@gmail.com"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-gray-300 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      <Navbar />

      <main className="grow relative z-10 px-6 py-12 max-w-xl mx-auto flex flex-col items-center pb-32">
        <div className="mb-8 p-4 bg-slate-900/50 rounded-2xl border border-white/10 shadow-xl">
            <MessageSquare className="w-10 h-10 text-cyan-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">Support & Contact</h1>
        <p className="text-gray-400 mb-10 text-center">
          Have a suggestion, found a bug, or just want to say hi? 
          Reach out to me on any of these platforms.
        </p>

        <div className="grid grid-cols-1 gap-4 w-full">
          {socials.map((social) => (
            <a 
              key={social.name}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between p-5 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-slate-800/60 group`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-slate-950/50 ${social.color} transition-colors`}>
                    {social.icon}
                </div>
                <div className="flex flex-col">
                    <span className="text-white font-semibold">{social.name}</span>
                    <span className="text-xs text-gray-500 group-hover:text-gray-400">{social.username}</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
            </a>
          ))}
        </div>

        {/* Ko-fi Quick Link */}
        <div className="mt-12 w-full p-6 rounded-3xl bg-linear-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 text-center">
            <h3 className="text-white font-bold mb-2">Want to support development?</h3>
            <p className="text-sm text-gray-400 mb-6">Your contributions help keep ZeroBG free and local for everyone.</p>
            <a 
                href="https://ko-fi.com/baroi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-cyan-500 to-teal-500 rounded-xl text-slate-950 font-bold text-sm shadow-lg hover:opacity-90 transition-all active:scale-95"
            >
                Donate via Ko-fi
            </a>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
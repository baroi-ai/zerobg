"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { ShieldCheck, EyeOff, HardDrive, Lock } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-gray-300 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      <Navbar />

      <main className="grow relative z-10 px-6 py-12 max-w-2xl mx-auto pb-32">
        <div className="flex items-center gap-4 mb-6">
          <ShieldCheck className="text-teal-400 w-8 h-8" />
          <h1 className="text-4xl font-bold text-white">Privacy <span className="text-teal-400">Policy</span></h1>
        </div>

        <p className="text-sm text-slate-500 mb-8 uppercase tracking-widest">Last Updated: May 2026</p>

        <div className="grid gap-6 mb-10">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-sm flex gap-4">
            <EyeOff className="text-cyan-400 w-10 h-10 shrink-0" />
            <div>
              <h3 className="text-white font-bold mb-1">No Data Collection</h3>
              <p className="text-sm text-gray-500">We do not collect, store, or share your images. Your data never leaves your browser.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-sm flex gap-4">
            <HardDrive className="text-teal-400 w-10 h-10 shrink-0" />
            <div>
              <h3 className="text-white font-bold mb-1">Local Storage</h3>
              <p className="text-sm text-gray-500">ZeroBG may use local browser storage to remember your preferred AI model (HD or Fast), but this data is never sent to us.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" /> AI Processing
            </h2>
            <p>
              ZeroBG utilizes client-side machine learning. When you select an image, it is processed within your device's memory. Baroi AI has no technical means of accessing the images you process.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">Contact Us</h2>
            <p>If you have questions about this policy, you can reach out via the Support page or directly to Baroi AI.</p>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
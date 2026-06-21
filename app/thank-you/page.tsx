"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Phone, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export default function ThankYou() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-[#ededed] overflow-x-hidden flex flex-col justify-between">
      {/* Logo */}
      <div className="flex justify-center top-0 pt-8">
        <Image
          src="/logo.png"
          alt="Logo"
          width={200}
          height={36}
          className=""
        />
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 flex-1 flex items-center justify-center py-12">
        <div className="bg-gradient-to-br from-[#1e2740] to-[#151d30] rounded-2xl p-6 sm:p-10 shadow-[0_0_50px_rgba(0,212,255,0.15)] border-2 border-[#00d4ff]/30 w-full max-w-xl text-center space-y-6 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-500 animate-pulse" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Thank You!
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              Your information has been received. Our team will review
              your details and reach out to you within 24 hours to discuss
              exclusive lead opportunities tailored to your markets.
            </p>
            <div className="pt-4 border-t border-gray-800">
              <div className="inline-flex items-center space-x-2 text-[#00d4ff] text-sm sm:text-base font-semibold">
                <Phone className="w-5 h-5 animate-bounce" />
                <span>Expect a call from our team soon!</span>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 bg-[#00d4ff] text-[#0a0f1a] px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#00b8e6] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 max-w-full">
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Lead Stream Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

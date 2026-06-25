"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SAMPLE_KEYS = [
  { product: 'Windows 11 Pro', key: 'XJK4N-7C9VB-W2P3Q-M8R5T' },
  { product: 'Office 2021', key: 'BV9F2-N8P4X-K6M3D-H7J5W' },
  { product: 'Norton 360', key: 'M4P9Q-R7T2X-K3N5D-B6V8F' },
  { product: 'Adobe CC', key: 'A8H3K-N5P2Q-W7T9M-B4R6X' },
  { product: 'Kaspersky', key: 'G5N8P-2Q4R7-X9M3D-B6V1W' },
  { product: 'Visual Studio', key: 'Y7H4K-N9P2Q-M5R8T-B3V6X' },
];

function formatKey(k: string) {
  return k.match(/.{1,5}/g)?.join('-') || k;
}

export default function KeyFeed() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [status, setStatus] = useState<'generating' | 'delivered'>('generating');

  useEffect(() => {
    const current = SAMPLE_KEYS[index];
    const target = formatKey(current.key);

    if (status === 'generating') {
      if (displayed.length < target.length) {
        const timeout = setTimeout(() => {
          setDisplayed(target.slice(0, displayed.length + 1));
        }, 45);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setStatus('delivered'), 600);
        return () => clearTimeout(timeout);
      }
    } else {
      const timeout = setTimeout(() => {
        setDisplayed('');
        setStatus('generating');
        setIndex((prev) => (prev + 1) % SAMPLE_KEYS.length);
      }, 2200);
      return () => clearTimeout(timeout);
    }
  }, [displayed, status, index]);

  const current = SAMPLE_KEYS[index];

  return (
    <div className="relative bg-[#0c0e14] border border-white/[0.06] rounded-xl overflow-hidden">
      {/* Subtle scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#9eb8d9]/30 to-transparent animate-scan" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04] bg-[#08090c]/50">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#6b7080]">live.delivery</span>
        </div>
        <span className="font-mono text-[10px] text-[#6b7080]">
          {new Date().toLocaleTimeString('en-US', { hour12: false })}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 font-mono">
        <div className="flex items-center justify-between mb-3 text-[11px]">
          <span className="text-[#6b7080] uppercase tracking-wider">product</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={current.product}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-[#e8e6e1] font-display"
            >
              {current.product}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mb-2 text-[11px]">
          <span className="text-[#6b7080] uppercase tracking-wider">key</span>
          <span className="text-[10px] text-[#6b7080]">
            {status === 'generating' ? 'generating...' : 'delivered ✓'}
          </span>
        </div>

        <div className="bg-[#06080c] border border-white/[0.04] rounded-md px-3 py-3 min-h-[44px] flex items-center">
          <span className="text-[#9eb8d9] text-sm tracking-wider">
            {displayed}
            {status === 'generating' && (
              <span className="inline-block w-1.5 h-3.5 bg-[#9eb8d9] ml-0.5 align-middle" style={{ animation: 'cursor-blink 1s infinite' }} />
            )}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-[10px] text-[#6b7080]">
          <span>region: GLOBAL</span>
          <span>format: 5x5</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';

interface KeyRevealerProps {
  keys: { id: string; code: string }[];
}

export default function KeyRevealer({ keys }: KeyRevealerProps) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const handleReveal = (id: string) => {
    setRevealed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopied((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Tus Claves de Activación</span>
      
      {keys.map((key, idx) => {
        const isRevealed = revealed[key.id];
        const isCopied = copied[key.id];

        return (
          <div 
            key={key.id}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#080a0f] border border-[#1e2535] p-3 sm:p-4 rounded-xl group hover:border-accent-purple/30 transition-all duration-200"
          >
            {/* Index label and Key container */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-xs font-bold text-accent-orange bg-accent-orange/15 px-2 py-1 rounded">
                KEY #{idx + 1}
              </span>
              
              <div className="flex-1 font-mono font-black text-sm tracking-wider text-center sm:text-left min-w-0 select-all">
                {isRevealed ? (
                  <span className="text-emerald-400 select-all truncate block">
                    {key.code}
                  </span>
                ) : (
                  <span className="text-gray-600 tracking-widest blur-xs select-none truncate block">
                    ••••-••••-••••-••••
                  </span>
                )}
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex items-center justify-center gap-2">
              {/* Reveal button */}
              <button
                onClick={() => handleReveal(key.id)}
                className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg border flex items-center gap-1.5 transition-all duration-200 ${
                  isRevealed
                    ? 'bg-[#1c2130] border-[#2e374c] text-gray-300 hover:text-white'
                    : 'bg-accent-purple/10 border-accent-purple/30 text-accent-purple hover:bg-accent-purple hover:text-white shadow-md shadow-accent-purple/5'
                }`}
              >
                {isRevealed ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    <span>Ocultar</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    <span>Revelar Clave</span>
                  </>
                )}
              </button>

              {/* Copy button */}
              <button
                disabled={!isRevealed}
                onClick={() => handleCopy(key.id, key.code)}
                className={`p-2 rounded-lg border transition-all ${
                  !isRevealed
                    ? 'bg-gray-800/10 border-gray-800/20 text-gray-700 cursor-not-allowed'
                    : isCopied
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-500'
                      : 'bg-[#1e2535] border-[#2e374c] text-gray-400 hover:text-white hover:border-[#3d4a66]'
                }`}
                title="Copiar Clave"
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

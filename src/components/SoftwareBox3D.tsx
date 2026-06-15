"use client";

import React from 'react';
import Image from 'next/image';

interface SoftwareBox3DProps {
  image: string;
  title: string;
  platform: string;
  className?: string;
}

export default function SoftwareBox3D({ image, title, platform, className = "" }: SoftwareBox3DProps) {
  // Determine spine color based on product/platform
  const getSpineColor = (p: string) => {
    const norm = p.toLowerCase();
    if (norm.includes('office')) return 'bg-orange-600';
    if (norm.includes('security')) return 'bg-emerald-600';
    if (norm.includes('server')) return 'bg-blue-800';
    return 'bg-blue-600'; // Default Windows blue
  };

  const spineColorClass = getSpineColor(platform);

  return (
    <div className={`relative group/box ${className}`} style={{ perspective: "1000px" }}>
      {/* Box Container with 3D Transforms */}
      <div 
        className="relative w-full aspect-[3/4] transition-all duration-500 ease-out preserve-3d"
        style={{
          transform: "rotateY(-18deg) rotateX(6deg)",
          transformStyle: "preserve-3d"
        }}
      >
        {/* Shadow / Reflection beneath the box */}
        <div className="absolute -bottom-5 left-[5%] right-[5%] h-5 bg-black/60 rounded-full blur-md group-hover/box:scale-105 group-hover/box:opacity-75 transition-all duration-500 pointer-events-none" />
        <div className="absolute -bottom-3 left-[15%] right-[15%] h-3 bg-accent-blue/20 rounded-full blur-sm pointer-events-none" />

        {/* 1. FRONT FACE */}
        <div 
          className="absolute inset-0 w-full h-full rounded-l-lg rounded-r bg-[#121520] overflow-hidden border border-white/10 z-10"
          style={{
            transform: "translateZ(10px)",
            backfaceVisibility: "hidden"
          }}
        >
          <Image 
            src={image} 
            alt={title} 
            fill
            sizes="(max-width: 768px) 150px, 200px"
            className="object-cover"
            loading="lazy"
            unoptimized={false}
          />
          {/* Subtle reflection shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-60 group-hover/box:translate-x-full transition-transform duration-1000 ease-out" />
        </div>

        {/* 2. SIDE SPINE (Provides the 3D Depth) */}
        <div 
          className={`absolute top-0 bottom-0 w-[20px] ${spineColorClass} border-y border-white/10 origin-right flex flex-col items-center justify-center`}
          style={{
            right: "100%",
            transform: "rotateY(-90deg) translateZ(10px)",
            backfaceVisibility: "hidden"
          }}
        >
          {/* Spine text */}
          <span className="text-[7px] font-black tracking-widest text-white/70 uppercase rotate-90 truncate max-w-[90px] block">
            {platform}
          </span>
        </div>

        {/* 3. GLOW EFFECT */}
        <div className="absolute inset-0 bg-accent-blue/10 rounded-lg blur-md opacity-0 group-hover/box:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
      </div>
    </div>
  );
}

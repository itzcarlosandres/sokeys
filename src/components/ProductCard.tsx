"use client";

import React from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { useCart } from '@/context/CartContext';
import { ArrowRight, Gift } from 'lucide-react';

interface ProductCardProps {
  id: string; title: string; slug: string; price: number; originalPrice: number | null;
  image: string; platform: string; region: string; rating: number; type: string;
  badges?: { id: string; name: string; icon: string; color: string; bgColor: string; borderColor: string }[];
  pointsPerDollar?: number;
}

const PLATFORM_CODES: Record<string, string> = {
  windows: 'WIN',
  office: 'OFF',
  security: 'SEC',
  server: 'SRV',
  'sql server': 'SQL',
  'visual studio': 'VST',
};

function platformCode(platform: string): string {
  const norm = platform.toLowerCase();
  if (PLATFORM_CODES[norm]) return PLATFORM_CODES[norm];
  return platform.slice(0, 3).toUpperCase();
}

export default function ProductCard({ id, title, slug, price, originalPrice, image, platform, region, rating, type, badges = [], pointsPerDollar = 10 }: ProductCardProps) {
  const { addToCart } = useCart();
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const pointsEarned = Math.floor(price * pointsPerDollar);
  const pCode = platformCode(platform);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({ id, title, slug, price, originalPrice, image, platform, region });
  };

  return (
    <Link href={`/product/${slug}`} className="group block h-full">
      <div className="relative h-full bg-[#0c0e14] border border-white/[0.04] hover:border-[#9eb8d9]/30 rounded-lg overflow-hidden transition-all duration-300 lift flex flex-col">

        {/* Image with eyebrow + discount tag */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#06080c] shrink-0">
          <SafeImage src={image} alt={title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover group-hover:scale-[1.04] transition-transform duration-500" />

          {/* Top-left: platform code eyebrow */}
          <div className="absolute top-3 left-3 z-10">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#e8e6e1] bg-[#08090c]/80 backdrop-blur-sm border border-white/[0.06] px-1.5 py-0.5 rounded">
              //{pCode}
            </span>
          </div>

          {/* Top-right: discount tag */}
          {discount > 0 && (
            <div className="absolute top-3 right-3 z-10">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#9eb8d9] bg-[#08090c]/80 backdrop-blur-sm border border-[#9eb8d9]/30 px-1.5 py-0.5 rounded">
                -{discount}%
              </span>
            </div>
          )}

          {/* Subtle scan line on hover */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#9eb8d9]/40 to-transparent" style={{ top: '50%' }} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow gap-3">

          {/* Title */}
          <h3 className="font-display text-[15px] font-medium text-[#e8e6e1] line-clamp-2 leading-[1.25] min-h-[38px] tracking-[-0.01em]">
            {title}
          </h3>

          {/* Meta line: type · region */}
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#6b7080]">
            <span>{type || 'Digital'}</span>
            <span>·</span>
            <span>{region}</span>
          </div>

          {/* Points block */}
          <div className="flex items-center gap-2 bg-[#9eb8d9]/[0.06] border border-[#9eb8d9]/20 rounded-md px-2.5 py-1.5 font-mono">
            <Gift className="h-3.5 w-3.5 text-[#9eb8d9] shrink-0" />
            <span className="text-[11px] text-[#9eb8d9]">+{pointsEarned} pts</span>
          </div>

          {/* Price row */}
          <div className="mt-auto pt-1 flex items-end justify-between gap-2">
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-[15px] font-semibold text-[#e8e6e1]">
                ${price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-[10px] text-[#6b7080] line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {originalPrice && (
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#6b7080]">
                MSRP
              </span>
            )}
          </div>

          {/* Add to cart CTA */}
          <button
            onClick={handleAddToCart}
            className="group/btn w-full flex items-center justify-between px-3 py-2 bg-[#06080c] hover:bg-[#9eb8d9]/10 border border-white/[0.06] hover:border-[#9eb8d9]/30 rounded-md text-[11px] font-mono uppercase tracking-wider text-[#e8e6e1] hover:text-[#9eb8d9] transition-all duration-300 cursor-pointer"
          >
            <span>Add to cart</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </Link>
  );
}

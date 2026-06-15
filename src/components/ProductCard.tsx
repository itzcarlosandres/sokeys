"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Globe, Star, Zap, Trophy, ShieldCheck, Clock, Award, CheckCircle2, Tag, Monitor, HardDrive, Shield, Cpu, Database, Code, Bug, Gamepad2, Server, Key } from 'lucide-react';
import SoftwareBox3D from './SoftwareBox3D';

interface ProductCardProps {
  id: string; title: string; slug: string; price: number; originalPrice: number | null;
  image: string; platform: string; region: string; rating: number; type: string;
  badges?: { id: string; name: string; icon: string; color: string; bgColor: string; borderColor: string }[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  Star, Trophy, ShieldCheck, Zap, Clock, Award, CheckCircle2, Tag, Monitor, HardDrive, Shield, Cpu, Database, Code, Bug, Globe, Gamepad2, Server, Key
};

export default function ProductCard({ id, title, slug, price, originalPrice, image, platform, region, rating, type, badges = [] }: ProductCardProps) {
  const { addToCart } = useCart();
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({ id, title, slug, price, originalPrice, image, platform, region });
  };

  return (
    <Link href={`/product/${slug}`} className="group block h-full">
      <div className="relative h-full bg-[#0a0e1a] border border-white/[0.04] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.08] hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)] flex flex-col">

        {discount > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-white/[0.08] border border-white/[0.08] text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-lg tracking-wide">
            -{discount}%
          </span>
        )}

        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
          <span className="bg-[#060608]/80 backdrop-blur-sm text-gray-500 text-[9px] font-medium px-2 py-0.5 rounded-lg border border-white/[0.06] uppercase tracking-wider flex items-center gap-1">
            <Globe className="h-3 w-3 text-gray-600" />
            {region}
          </span>
          {badges.slice(0, 2).map(badge => {
            const IconComponent = ICON_MAP[badge.icon] || Star;
            return (
              <span key={badge.id} className={`${badge.bgColor} ${badge.color} text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${badge.borderColor} flex items-center gap-1`}>
                <IconComponent className="h-3 w-3" />
                {badge.name}
              </span>
            );
          })}
        </div>

        <div className="relative flex justify-center items-center py-6 px-8 bg-[#060608] border-b border-white/[0.04] overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
          <div className="relative z-10">
            <SoftwareBox3D image={image} title={title} platform={platform} className="w-[100px] sm:w-[110px]" />
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">{platform}</span>
            <div className="flex items-center gap-1 text-[10px] text-gray-500">
              <Star className="h-3 w-3 fill-gray-600 text-gray-600" />
              <span className="font-medium text-gray-300">{rating.toFixed(1)}</span>
            </div>
          </div>

          <h3 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors line-clamp-2 min-h-[40px] leading-snug mb-3">
            {title}
          </h3>

          <div className="mt-auto pt-3 border-t border-white/[0.04] flex items-center justify-between gap-2">
            <div className="flex flex-col">
              {originalPrice && <span className="text-[10px] text-gray-600 line-through">${originalPrice.toFixed(2)}</span>}
              <span className="text-base font-bold text-white group-hover:text-gray-300 transition-colors">${price.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-500 text-[9px] font-medium flex items-center gap-1 bg-white/[0.03] px-2 py-0.5 rounded-lg border border-white/[0.04]">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse" />
                Stock
              </span>
              <button onClick={handleAddToCart}
                className="p-2 bg-[#060608] hover:bg-white/[0.08] text-gray-500 hover:text-gray-300 rounded-lg border border-white/[0.06] hover:border-white/[0.10] transition-all duration-200 cursor-pointer"
                title="Añadir al carrito">
                <ShoppingCart className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

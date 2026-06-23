"use client";

import React from 'react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Gift } from 'lucide-react';

interface ProductCardProps {
  id: string; title: string; slug: string; price: number; originalPrice: number | null;
  image: string; platform: string; region: string; rating: number; type: string;
  badges?: { id: string; name: string; icon: string; color: string; bgColor: string; borderColor: string }[];
  pointsPerDollar?: number;
}

export default function ProductCard({ id, title, slug, price, originalPrice, image, platform, region, rating, type, badges = [], pointsPerDollar = 10 }: ProductCardProps) {
  const { addToCart } = useCart();
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const pointsEarned = Math.floor(price * pointsPerDollar);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({ id, title, slug, price, originalPrice, image, platform, region });
  };

  return (
    <Link href={`/product/${slug}`} className="group block h-full">
      <div className="relative h-full bg-[#1a1d23] rounded-lg overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col">

        {/* Imagen del producto */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#0f1115] shrink-0">
          <SafeImage src={image} alt={title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>

        {/* Contenido */}
        <div className="p-3 flex flex-col flex-grow gap-2">

          {/* Título */}
          <h3 className="text-sm font-medium text-white line-clamp-2 leading-snug min-h-[40px]">
            {title}
          </h3>

          {/* Región */}
          <span className="text-[11px] font-bold text-[#00d4ff] uppercase tracking-wide">
            {region}
          </span>

          {/* Badge "desde US$ X.XX" */}
          <div className="flex items-center gap-1.5 bg-[#252830] border border-[#6c5ce7]/40 rounded-md px-2.5 py-1.5">
            <ShoppingCart className="h-3.5 w-3.5 text-[#6c5ce7]" />
            <span className="text-xs text-white font-medium">desde US$ {price.toFixed(2)}</span>
          </div>

          {/* Puntos a ganar */}
          <div className="flex items-center gap-1.5 bg-[#6c5ce7]/10 border border-[#6c5ce7]/30 rounded-md px-2.5 py-1.5">
            <Gift className="h-3.5 w-3.5 text-[#6c5ce7]" />
            <span className="text-xs text-[#6c5ce7] font-medium">Ganás {pointsEarned} puntos</span>
          </div>

          {/* Precio + Descuento */}
          <div className="mt-auto pt-2 flex items-end justify-between gap-2">
            <div className="flex flex-col">
              {originalPrice && (
                <span className="text-[10px] text-gray-500">desde</span>
              )}
              <span className="text-lg font-bold text-white">
                US$ {price.toFixed(2)}
              </span>
            </div>
            {discount > 0 && (
              <span className="bg-[#e74c3c] text-white text-xs font-bold px-2 py-0.5 rounded-md">
                -{discount}%
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Zap, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ProductActionsProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    originalPrice: number | null;
    image: string;
    platform: string;
    region: string;
  };
  stockCount: number;
}

export default function ProductActions({ product, stockCount }: ProductActionsProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      platform: product.platform,
      region: product.region,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      platform: product.platform,
      region: product.region,
    });
    router.push('/cart');
  };

  const hasStock = stockCount > 0;

  return (
    <div className="bg-[#11141d] border border-[#1e2535] rounded-2xl p-6 shadow-xl flex flex-col gap-5">
      
      {/* Price Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="text-3xl sm:text-4xl font-black text-white">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 line-through font-semibold">${product.originalPrice.toFixed(2)}</span>
              <span className="text-[10px] bg-accent-orange/15 text-accent-orange font-extrabold px-1.5 py-0.5 rounded uppercase">
                Ahorras {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stock & Region status */}
      <div className="flex flex-col gap-3 py-3 border-y border-[#1e2535]/50 text-xs">
        {/* Region check */}
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="font-extrabold text-white">Activación {product.region}</span>
            <p className="text-gray-500">Se puede activar y jugar sin restricciones territoriales.</p>
          </div>
        </div>

        {/* Stock check */}
        <div className="flex items-start gap-2.5">
          {hasStock ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          )}
          <div className="flex flex-col gap-0.5">
            <span className="font-extrabold text-white">
              {hasStock ? "En Stock" : "Agotado Temporalmente"}
            </span>
            <p className="text-gray-500">
              {hasStock 
                ? `¡Entrega digital inmediata! Quedan ${stockCount} claves.`
                : "Se repondrán existencias en las próximas horas."}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleBuyNow}
          disabled={!hasStock}
          className={`w-full py-4 px-6 text-white text-sm font-black uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border shadow-lg ${
            hasStock
              ? 'bg-gradient-to-r from-accent-orange to-[#ff1f00] hover:from-accent-orange hover:to-[#ff5500] border-accent-orange/30 hover:scale-[1.01] cursor-pointer'
              : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Zap className={`h-4 w-4 ${hasStock ? 'fill-white' : ''}`} />
          <span>Comprar Ahora</span>
        </button>

        <button
          onClick={handleAddToCart}
          disabled={!hasStock}
          className={`w-full py-3.5 px-6 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border ${
            hasStock
              ? added
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                : 'bg-[#1e2535] border-[#2e374c] text-gray-200 hover:text-white hover:bg-[#252e42] hover:border-accent-orange/50'
              : 'bg-gray-800/50 border-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{added ? "¡Añadido!" : "Añadir al Carrito"}</span>
        </button>
      </div>

      {/* Seller info */}
      <div className="bg-[#080a0f] p-3 rounded-xl border border-[#1e2535] flex items-center justify-between text-xs">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-gray-500 font-extrabold uppercase">Vendedor</span>
          <span className="font-extrabold text-white text-gradient-premium">FastKeys Premium</span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-emerald-500 font-extrabold">99.8% Calificaciones Positivas</span>
          <p className="text-[9px] text-gray-500">Excelente Reputación (G2A Elite)</p>
        </div>
      </div>

    </div>
  );
}

import React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import KeyRevealer from '@/components/KeyRevealer';
import { CheckCircle2, ShieldCheck, Gamepad2, ArrowRight, Printer, AlertCircle } from 'lucide-react';

interface SuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
  }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams.orderId;

  if (!orderId) {
    notFound();
  }

  // Fetch the order from the DB
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
          keys: {
            where: { isSold: true }
          }
        }
      }
    }
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="flex-1 bg-[#080a0f] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header Box */}
        <div className="bg-[#11141d] border border-[#1e2535] rounded-3xl p-6 sm:p-10 text-center shadow-2xl relative overflow-hidden mb-8">
          {/* Neon Glow Circle */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-emerald-500/10 rounded-full filter blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-5">
            <div className="bg-emerald-500/15 border border-emerald-500/30 p-4 rounded-2xl text-emerald-500 shadow-lg shadow-emerald-500/5">
              <CheckCircle2 className="h-10 w-10 fill-emerald-500/10" />
            </div>

            <div className="flex flex-col gap-1.5">
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">¡Pago Completado Exitosamente!</h1>
              <p className="text-xs sm:text-sm text-emerald-400 font-bold">Tus licencias premium y claves digitales ya están listas para activar.</p>
            </div>

            <p className="text-xs text-gray-400 max-w-lg leading-relaxed">
              Hemos enviado una copia del recibo y las instrucciones de canje a tu correo electrónico: <strong>{order.customerEmail}</strong>. Las claves están listadas a continuación.
            </p>
          </div>
        </div>

        {/* Invoice details & Key Reveal Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Main Key Delivery List (2 columns) */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <h2 className="text-sm font-black uppercase tracking-wider text-white border-b border-[#1e2535] pb-3 flex items-center gap-2">
              <Gamepad2 className="h-4 w-4 text-accent-orange" />
              <span>Tus Juegos Adquiridos</span>
            </h2>

            {order.items.map((item) => (
              <div 
                key={item.id}
                className="bg-[#11141d] border border-[#1e2535] rounded-2xl p-5 flex flex-col gap-5 shadow-xl hover:border-accent-purple/20 transition-all"
              >
                {/* Product details header inside the card */}
                <div className="flex items-center gap-4">
                  <div className="relative w-14 sm:w-16 aspect-[4/3] rounded-lg overflow-hidden shrink-0 border border-gray-800 bg-[#080a0f]">
                    <Image src={item.product.image} alt={item.product.title} fill sizes="(max-width: 640px) 56px, 64px" className="object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <span className="text-[10px] text-accent-purple font-black uppercase tracking-wider">
                      {item.product.platform} • {item.product.region}
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-white truncate uppercase leading-snug">
                      {item.product.title}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-semibold mt-0.5">
                      Cantidad: {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Key Revealer block for this item */}
                <div className="pt-2 border-t border-[#1e2535]/50">
                  <KeyRevealer keys={item.keys} />
                </div>
              </div>
            ))}
          </div>

          {/* Invoice Summary Card (1 column) */}
          <div className="bg-[#11141d] border border-[#1e2535] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-[#1e2535]/50 pb-3">
              Detalle de Factura
            </h3>

            <div className="flex flex-col gap-3 text-xs leading-normal">
              <div className="flex justify-between items-center text-gray-400">
                <span>Cliente:</span>
                <span className="font-bold text-gray-200">{order.customerName}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>Pedido ID:</span>
                <span className="font-mono text-[10px] text-gray-400 bg-[#1e2535] px-1.5 py-0.5 rounded border border-gray-800 truncate max-w-[120px]" title={order.id}>
                  {order.id.substring(0, 8)}...
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>Fecha:</span>
                <span className="font-semibold text-gray-200">
                  {new Date(order.createdAt).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>Estado:</span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full font-black uppercase">
                  PAGADO
                </span>
              </div>

              <div className="border-t border-[#1e2535]/50 pt-3 mt-1 flex justify-between items-center">
                <span className="font-extrabold text-white text-xs uppercase tracking-wider">Monto Total:</span>
                <span className="text-accent-orange text-base font-black">${order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Quick Safety info and Return CTA */}
            <div className="flex flex-col gap-3 border-t border-[#1e2535]/30 pt-4">
              <div className="flex gap-2 text-[10px] text-gray-500 leading-relaxed">
                <AlertCircle className="h-4 w-4 text-accent-purple shrink-0" />
                <p>
                  Las claves de activación son de un solo uso. Recomendamos canjearlas inmediatamente siguiendo las guías incluidas en la ficha de cada producto.
                </p>
              </div>

              <Link
                href="/"
                className="w-full py-3 bg-[#1e2535] hover:bg-[#252e42] text-gray-200 hover:text-white font-black text-xs uppercase tracking-widest text-center rounded-xl border border-[#2e374c] transition-all flex items-center justify-center gap-1.5"
              >
                <span>Volver al Catálogo</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

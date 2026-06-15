"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/app/actions';
import { Trash2, Plus, Minus, ShoppingBag, ShieldCheck, Mail, User, CreditCard, Loader2 } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  // Contact Info states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  
  // Payment States (simulated)
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Simulated Fees
  const shieldFee = cart.length > 0 ? 1.50 : 0;
  const vatFee = cartTotal * 0.05; // 5% simulated VAT
  const finalTotal = cartTotal + shieldFee + vatFee;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email.trim() || !name.trim()) {
      setErrorMsg('Por favor completa tu nombre y correo electrónico.');
      return;
    }

    if (cart.length === 0) {
      setErrorMsg('Tu carrito está vacío.');
      return;
    }

    // Basic credit card check (mock)
    if (cardNumber.replace(/\s/g, '').length < 13 || !expiry || cvc.length < 3) {
      setErrorMsg('Por favor introduce detalles de pago válidos (tarjeta simulada).');
      return;
    }

    setIsSubmitting(true);

    try {
      // Map cart to inputs
      const orderItems = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      // Call Server Action
      const response = await createOrder({
        email: email.trim(),
        name: name.trim(),
        items: orderItems,
        total: finalTotal,
        userId: user?.id || null,
      });

      if (response.success && response.orderId) {
        // Clear local storage cart
        clearCart();
        // Redirect to success
        router.push(`/checkout/success?orderId=${response.orderId}`);
      } else {
        setErrorMsg(response.error || "Ocurrió un error al procesar la orden.");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "Error al conectar con el servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 bg-[#080a0f]">
        <div className="max-w-md w-full bg-[#11141d] border border-[#1e2535] p-8 rounded-2xl shadow-2xl text-center flex flex-col items-center gap-5">
          <div className="bg-accent-orange/10 p-4 rounded-full text-accent-orange">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-black uppercase text-white tracking-wider">Tu Carrito está Vacío</h1>
            <p className="text-xs text-gray-400">¿Buscas ofertas premium? Explora nuestro catálogo y encuentra las mejores claves digitales.</p>
          </div>
          <Link
            href="/"
            className="w-full py-3 bg-gradient-to-r from-accent-orange to-accent-purple hover:scale-[1.01] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg"
          >
            Explorar Juegos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#080a0f] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-8">
          Tu Carrito de Compra ({cart.length} {cart.length === 1 ? 'artículo' : 'artículos'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart items */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {cart.map((item) => (
              <div 
                key={item.id}
                className="bg-[#11141d] border border-[#1e2535] rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-5 items-center justify-between shadow-md hover:border-accent-purple/20 transition-all duration-200"
              >
                {/* Thumb */}
                <div className="w-16 sm:w-20 aspect-[14/10] sm:aspect-[4/3] bg-[#080a0f] rounded-lg overflow-hidden shrink-0 border border-gray-800">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>

                {/* Info and Quantities */}
                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                  <span className="text-[9px] font-bold text-accent-purple uppercase tracking-wider">
                    {item.platform} • {item.region}
                  </span>
                  <Link href={`/product/${item.slug}`} className="text-xs sm:text-sm font-bold text-white hover:text-accent-orange transition-colors truncate">
                    {item.title}
                  </Link>

                  {/* Quantity Actions */}
                  <div className="flex items-center gap-2.5 mt-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 bg-[#1e2535] hover:bg-accent-orange text-gray-400 hover:text-white rounded border border-[#2e374c] transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs font-bold text-gray-200 w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 bg-[#1e2535] hover:bg-accent-orange text-gray-400 hover:text-white rounded border border-[#2e374c] transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Prices & Delete */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <div className="flex flex-col items-end">
                    <span className="text-sm sm:text-base font-black text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-[10px] text-gray-500">
                        ${item.price.toFixed(2)} c/u
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors"
                    title="Eliminar artículo"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Right Column: Checkout Form and Summary */}
          <form 
            onSubmit={handleCheckoutSubmit}
            className="lg:col-span-5 bg-[#11141d] border border-[#1e2535] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-6"
          >
            <h2 className="text-sm font-black uppercase text-white tracking-widest border-b border-[#1e2535]/50 pb-3 flex items-center gap-1.5">
              <span>Resumen y Pago Seguro</span>
            </h2>

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-xs font-bold">
                {errorMsg}
              </div>
            )}

            {/* Input: Customer Name & Email */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Información de Entrega</label>
              
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <User className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Tu Nombre Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1e2535] text-xs font-semibold text-gray-200 pl-9 pr-3 py-3 rounded-xl border border-[#2e374c] focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="Tu Correo Electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1e2535] text-xs font-semibold text-gray-200 pl-9 pr-3 py-3 rounded-xl border border-[#2e374c] focus:outline-none focus:border-accent-purple"
                />
              </div>
              <p className="text-[9px] text-gray-500 leading-normal">
                Asegúrate de ingresar un correo real, ya que enviaremos tus claves de juego allí inmediatamente.
              </p>
            </div>

            {/* Simulated Payment Card Form */}
            <div className="flex flex-col gap-3 border-t border-[#1e2535]/30 pt-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-between">
                <span>Método de Pago (Simulador)</span>
                <span className="text-[8px] text-accent-orange font-bold">Modo de Pruebas Seguro</span>
              </label>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <CreditCard className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Número de Tarjeta (16 dígitos)"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => {
                    // Quick formatting
                    let val = e.target.value.replace(/\D/g, '');
                    let matches = val.match(/\d{4,16}/g);
                    let match = matches && matches[0] || '';
                    let parts = [];
                    for (let i=0, len=match.length; i<len; i+=4) {
                      parts.push(match.substring(i, i+4));
                    }
                    if (parts.length > 0) {
                      setCardNumber(parts.join(' '));
                    } else {
                      setCardNumber(val);
                    }
                  }}
                  className="w-full bg-[#1e2535] text-xs font-semibold text-gray-200 pl-9 pr-3 py-3 rounded-xl border border-[#2e374c] focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="MM/AA"
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length >= 2) {
                      setExpiry(val.substring(0, 2) + '/' + val.substring(2, 4));
                    } else {
                      setExpiry(val);
                    }
                  }}
                  className="w-full bg-[#1e2535] text-xs font-semibold text-gray-200 px-3 py-3 rounded-xl border border-[#2e374c] text-center focus:outline-none focus:border-accent-purple"
                />
                <input
                  type="password"
                  required
                  placeholder="CVC"
                  maxLength={3}
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#1e2535] text-xs font-semibold text-gray-200 px-3 py-3 rounded-xl border border-[#2e374c] text-center focus:outline-none focus:border-accent-purple"
                />
              </div>
            </div>

            {/* Detailed Pricing Breakdown */}
            <div className="border-t border-[#1e2535]/50 pt-4 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between text-gray-400 font-medium">
                <span>Subtotal Juegos:</span>
                <span className="text-gray-200">${cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between text-gray-400 font-medium">
                <span className="flex items-center gap-1">
                  <span>FastKeys Shield &amp; Fee:</span>
                  <ShieldCheck className="h-3.5 w-3.5 text-accent-orange fill-accent-orange/10" />
                </span>
                <span className="text-gray-200">${shieldFee.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-gray-400 font-medium">
                <span>IVA y Procesamiento (5%):</span>
                <span className="text-gray-200">${vatFee.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-base font-black text-white uppercase tracking-wider border-t border-[#1e2535]/30 pt-3 mt-1">
                <span>Total a Pagar:</span>
                <span className="text-accent-orange text-lg">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-accent-orange via-[#ff1f00] to-accent-purple hover:scale-[1.01] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-xl shadow-accent-orange/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  <span>Procesando Pago Seguro...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4.5 w-4.5" />
                  <span>Proceder al Pago Seguro</span>
                </>
              )}
            </button>

            {/* Secured lock statement */}
            <p className="text-[9px] text-gray-500 text-center leading-normal">
              Cifrado SSL de 256 bits. Al hacer clic en Proceder al Pago, aceptas nuestros términos y condiciones de entrega digital.
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}

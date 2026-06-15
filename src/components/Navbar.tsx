"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, Search, Menu, X, User, ShieldCheck, Headphones, Globe, Sparkles, LogOut, ChevronDown, LayoutDashboard, Hexagon } from 'lucide-react';

export default function Navbar() {
  const { cartCount, cartTotal } = useCart();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(searchQuery.trim() ? `/?search=${encodeURIComponent(searchQuery.trim())}` : '/');
  };

  return (
    <header className="w-full flex flex-col z-50 sticky top-0">

      {/* Top bar */}
      <div className="bg-[#05070d] text-xs text-gray-500 border-b border-white/[0.04] py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors cursor-pointer">
              <Headphones className="h-3.5 w-3.5 text-gray-600" />
              <span className="text-[11px] font-medium">Soporte 24/7</span>
            </span>
            <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors cursor-pointer">
              <Globe className="h-3.5 w-3.5 text-gray-600" />
              <span className="text-[11px] font-medium">Entrega Global</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="text-[11px] font-medium">Distribuidor Oficial</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-[#080c18]/90 backdrop-blur-xl border-b border-white/[0.04] py-3.5 px-4 sm:px-6 lg:px-8 relative z-[60]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#007cff] to-blue-600 flex items-center justify-center shadow-lg shadow-[#007cff]/20 group-hover:shadow-[#007cff]/30 transition-all duration-300">
              <Hexagon className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white leading-none">Pixel<span className="text-[#007cff]">Codes</span></span>
              <span className="text-[9px] text-gray-600 font-medium uppercase tracking-wider leading-none mt-0.5">Licencias Premium</span>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
            <input type="text" placeholder="Buscar licencias, sistemas operativos, antivirus..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#04060a] text-sm text-gray-200 pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 focus:ring-1 focus:ring-[#007cff]/20 transition-all placeholder:text-gray-700" />
          </form>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2">
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <>
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-[#04060a] hover:bg-[#0a0e1a] rounded-xl border border-white/[0.06] hover:border-[#007cff]/30 transition-all cursor-pointer group">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#007cff]/30 to-blue-500/10 border border-[#007cff]/20 flex items-center justify-center">
                      <span className="text-xs font-semibold text-[#007cff]">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-200 max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown className={`h-3.5 w-3.5 text-gray-600 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-56 bg-[#0a0e1a] border border-white/[0.06] rounded-xl shadow-2xl py-2 z-[60] backdrop-blur-xl">
                      <div className="px-4 py-2.5 border-b border-white/[0.04] mb-1">
                        <p className="text-sm font-medium text-gray-200 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-white/[0.03] transition-colors">
                        <LayoutDashboard className="h-4 w-4 text-[#007cff]" />
                        Mi Panel
                      </Link>
                      <button onClick={() => { setUserMenuOpen(false); logout(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-white/[0.03] transition-colors cursor-pointer">
                        <LogOut className="h-4 w-4" />
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/auth"
                  className="flex items-center gap-2 px-3.5 py-2 bg-[#04060a] hover:bg-[#0a0e1a] rounded-xl border border-white/[0.06] hover:border-[#007cff]/30 transition-all text-sm font-medium text-gray-300">
                  <User className="h-4 w-4 text-[#007cff]" />
                  <span>Ingresar</span>
                </Link>
              )}
            </div>

            <Link href="/admin"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-300 transition-colors">
              <Sparkles className="h-4 w-4" />
              <span>Admin</span>
            </Link>

            <Link href="/cart"
              className="relative flex items-center gap-2 px-3.5 py-2 bg-[#04060a] hover:bg-[#0a0e1a] rounded-xl border border-white/[0.06] hover:border-[#007cff]/30 transition-all group">
              <ShoppingCart className="h-4 w-4 text-gray-400 group-hover:text-[#007cff] transition-colors" />
              {cartCount > 0 ? (
                <>
                  <span className="bg-[#007cff] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">{cartCount}</span>
                  <span className="text-sm font-semibold text-[#007cff]">${cartTotal.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-sm font-medium text-gray-500">Carrito</span>
              )}
            </Link>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/cart" className="relative p-2 bg-[#04060a] rounded-lg border border-white/[0.06]">
              <ShoppingCart className="h-4 w-4 text-gray-400" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[#007cff] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-[#04060a] text-gray-400 hover:text-gray-200 rounded-lg border border-white/[0.06]">
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Categories */}
      <div className="hidden md:block bg-[#04060a]/80 backdrop-blur-md border-b border-white/[0.04] py-2.5 px-4 sm:px-6 lg:px-8 relative z-[40]">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-medium text-gray-500">
          <div className="flex gap-6">
            <Link href="/" className="hover:text-gray-200 transition-colors">Todos</Link>
            <Link href="/?platform=Windows" className="hover:text-gray-200 transition-colors">Windows & OS</Link>
            <Link href="/?platform=Office" className="hover:text-gray-200 transition-colors">Office / Productividad</Link>
            <Link href="/?platform=Security" className="hover:text-gray-200 transition-colors">Antivirus & Seguridad</Link>
            <Link href="/?platform=Server" className="hover:text-gray-200 transition-colors">Dev & Servers</Link>
          </div>
          <span className="text-[10px] text-gray-600">Licencias Oficiales — Entrega Inmediata</span>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#080c18] backdrop-blur-xl border-b border-white/[0.04] py-4 px-4 flex flex-col gap-2">
          <form onSubmit={handleSearch} className="relative mb-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
            <input type="text" placeholder="Buscar..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#04060a] text-sm text-gray-200 pl-9 pr-4 py-2.5 rounded-lg border border-white/[0.06]" />
          </form>
          {user ? (
            <div className="flex items-center gap-2.5 px-3 py-2.5 bg-[#04060a] rounded-lg border border-white/[0.06]">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#007cff]/30 to-blue-500/10 border border-[#007cff]/20 flex items-center justify-center">
                <span className="text-[10px] font-semibold text-[#007cff]">{user.name.charAt(0)}</span>
              </div>
              <span className="flex-1 text-sm font-medium text-gray-200 truncate">{user.name}</span>
              <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="text-xs text-red-400 font-medium">Salir</button>
            </div>
          ) : (
            <Link href="/auth" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 bg-[#04060a] rounded-lg border border-white/[0.06] text-sm font-medium text-gray-300">
              <User className="h-4 w-4 text-[#007cff]" />
              Ingresar / Registrarse
            </Link>
          )}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 bg-[#04060a] rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors">Todos</Link>
            <Link href="/?platform=Windows" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 bg-[#04060a] rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors">Windows & OS</Link>
            <Link href="/?platform=Office" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 bg-[#04060a] rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors">Office</Link>
            <Link href="/?platform=Security" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 bg-[#04060a] rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors">Seguridad</Link>
          </div>
          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 bg-[#04060a] rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4 text-[#007cff]" /> Mi Panel
          </Link>
          <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 bg-[#04060a] rounded-lg text-sm font-medium text-[#007cff] flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Admin
          </Link>
        </div>
      )}

    </header>
  );
}

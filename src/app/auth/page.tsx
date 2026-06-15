"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';

export default function AuthPage() {
  const { login, register, user } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const errMsg = mode === 'login'
      ? await login(email, password)
      : await register(name, email, password);

    if (errMsg) {
      setError(errMsg);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#007cff]/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/3 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-white font-bold mb-6 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a la tienda
        </Link>

        <div className="bg-[#090d1a] border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 flex flex-col gap-6">
            <div className="text-center flex flex-col gap-2">
              <div className="flex justify-center mb-1">
                <div className="bg-[#007cff]/10 p-3 rounded-xl text-[#007cff]">
                  <User className="h-6 w-6" />
                </div>
              </div>
              <h1 className="text-lg font-black text-white uppercase tracking-tight">
                {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h1>
              <p className="text-[11px] text-gray-500 font-bold">
                {mode === 'login'
                  ? 'Accede a tu panel para ver tus licencias y pedidos.'
                  : 'Regístrate para gestionar tus compras y licencias.'}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3.5 rounded-lg text-xs font-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === 'register' && (
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text" required value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre completo"
                    className="w-full bg-[#141b2d] text-xs font-semibold text-gray-200 pl-10 pr-4 py-3.5 rounded-xl border border-white/5 focus:outline-none focus:border-[#007cff] placeholder-gray-500"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo electrónico"
                  className="w-full bg-[#141b2d] text-xs font-semibold text-gray-200 pl-10 pr-4 py-3.5 rounded-xl border border-white/5 focus:outline-none focus:border-[#007cff] placeholder-gray-500"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  minLength={6}
                  className="w-full bg-[#141b2d] text-xs font-semibold text-gray-200 pl-10 pr-10 py-3.5 rounded-xl border border-white/5 focus:outline-none focus:border-[#007cff] placeholder-gray-500"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#007cff] to-[#00bcff] hover:scale-[1.01] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#007cff]/10">
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /><span>Procesando...</span></>
                ) : (
                  <span>{mode === 'login' ? 'Acceder a Mi Panel' : 'Crear Cuenta'}</span>
                )}
              </button>
            </form>

            <div className="border-t border-white/5 pt-4 text-center">
              <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                className="text-[11px] text-[#007cff] font-bold hover:underline cursor-pointer">
                {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/dashboard" className="text-[10px] text-gray-600 hover:text-gray-400 font-bold transition-colors">
            ← Buscar pedidos sin cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}

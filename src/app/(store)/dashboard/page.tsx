"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  Search, Package, ChevronDown, ChevronUp, ExternalLink, Copy, Clock, Loader2,
  User, Mail, LogIn, LayoutDashboard, ShoppingBag, Settings, Heart, HelpCircle,
  ShieldCheck, Zap, Headphones, CreditCard, ArrowRight, LogOut, Eye, EyeOff,
  Lock, X, CheckCircle2, Gift, Trophy
} from 'lucide-react';

interface OrderItem {
  id: string;
  product: { title: string; slug: string; image: string };
  quantity: number;
  price: number;
  keys: { code: string }[];
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

type SideTab = 'overview' | 'orders' | 'settings';

const SIDE_NAV: { id: SideTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function DashboardPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const [sideTab, setSideTab] = useState<SideTab>('overview');

  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const searchOrders = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true); setError(''); setSearched(false);
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
      else setError(data.error || 'Error al buscar pedidos.');
    } catch { setError('Error de conexión.'); }
    setLoading(false); setSearched(true);
  };

  const copyKey = (code: string) => { navigator.clipboard.writeText(code); };

  if (authLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-32 bg-[#04060a]">
        <Loader2 className="h-8 w-8 text-[#007cff] animate-spin" />
      </div>
    );
  }

  const initials = user ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U';

  return (
    <div className="flex-1 bg-[#04060a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-8">My Account</h1>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ─── SIDEBAR ─── */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-[#0a0e1a] border border-white/[0.04] rounded-xl overflow-hidden">
              <nav className="p-2 space-y-0.5">
                {SIDE_NAV.map(item => {
                  const active = sideTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button key={item.id} onClick={() => setSideTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        active
                          ? 'bg-[#007cff]/10 text-[#007cff] border border-[#007cff]/15'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03] border border-transparent'
                      }`}>
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* ─── MAIN CONTENT ─── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Guest: email search */}
            {!user && (
              <>
                <form onSubmit={searchOrders} className="bg-[#0a0e1a] border border-white/[0.04] p-6 rounded-xl flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1 w-full flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com"
                        className="w-full bg-[#04060a] text-sm text-gray-200 pl-10 pr-4 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 placeholder:text-gray-700" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full sm:w-auto py-2.5 px-6 bg-gradient-to-r from-[#007cff] to-blue-600 hover:from-[#007cff] hover:to-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#007cff]/10">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    {loading ? 'Buscando...' : 'Buscar'}
                  </button>
                </form>
                <div className="text-center">
                  <Link href="/auth" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#007cff] hover:underline">
                    <LogIn className="h-4 w-4" />
                    Inicia sesión para ver tu historial completo
                  </Link>
                </div>
              </>
            )}

            {/* ─── OVERVIEW ─── */}
            {sideTab === 'overview' && user && <OverviewTab userId={user.id} userName={user.name} userEmail={user.email} orders={orders} setOrders={setOrders} expandedOrder={expandedOrder} setExpandedOrder={setExpandedOrder} copyKey={copyKey} />}
            {sideTab === 'overview' && !user && (
              <div className="bg-[#0a0e1a] border border-white/[0.04] p-8 rounded-xl text-center flex flex-col items-center gap-3">
                <User className="h-8 w-8 text-gray-600" />
                <p className="text-sm text-gray-500">Inicia sesión para ver tu panel completo.</p>
                <Link href="/auth" className="px-5 py-2 bg-[#007cff]/10 text-[#007cff] text-sm font-semibold rounded-lg border border-[#007cff]/20 hover:bg-[#007cff]/15 transition-all">
                  Iniciar Sesión
                </Link>
              </div>
            )}

            {/* ─── ORDERS ─── */}
            {sideTab === 'orders' && user && <OrdersTab userId={user.id} expandedOrder={expandedOrder} setExpandedOrder={setExpandedOrder} copyKey={copyKey} />}
            {sideTab === 'orders' && !user && (
              <div className="bg-[#0a0e1a] border border-white/[0.04] p-8 rounded-xl text-center flex flex-col items-center gap-3">
                <ShoppingBag className="h-8 w-8 text-gray-600" />
                <p className="text-sm text-gray-500">Inicia sesión para ver todos tus pedidos.</p>
              </div>
            )}

            {/* ─── SETTINGS ─── */}
            {sideTab === 'settings' && user && <SettingsTab userName={user.name} userEmail={user.email} logout={logout} />}
            {sideTab === 'settings' && !user && (
              <div className="bg-[#0a0e1a] border border-white/[0.04] p-8 rounded-xl text-center flex flex-col items-center gap-3">
                <Settings className="h-8 w-8 text-gray-600" />
                <p className="text-sm text-gray-500">Inicia sesión para acceder a tu configuración.</p>
              </div>
            )}

            {/* Guest: search results */}
            {!user && searched && (
              <div className="flex flex-col gap-4">
                {orders.length === 0 ? (
                  <div className="bg-[#0a0e1a] border border-white/[0.04] p-8 rounded-xl text-center flex flex-col items-center gap-3">
                    <Package className="h-8 w-8 text-gray-600" />
                    <p className="text-sm text-gray-500">No encontramos pedidos con ese email.</p>
                  </div>
                ) : (
                  orders.map(order => <OrderCard key={order.id} order={order} expandedOrder={expandedOrder} setExpandedOrder={setExpandedOrder} copyKey={copyKey} />)
                )}
              </div>
            )}

            {/* Guest: empty state */}
            {!user && !searched && (
              <div className="bg-[#0a0e1a] border border-white/[0.04] p-8 rounded-xl text-center flex flex-col items-center gap-3">
                <Search className="h-8 w-8 text-gray-600" />
                <p className="text-sm text-gray-500">Ingresa tu email y presiona "Buscar" para consultar tus pedidos.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   OVERVIEW TAB
   ═══════════════════════════════════════════════════ */
function OverviewTab({ userId, userName, userEmail, orders, setOrders, expandedOrder, setExpandedOrder, copyKey }: {
  userId: string; userName: string; userEmail: string; orders: Order[]; setOrders: (o: Order[]) => void;
  expandedOrder: string | null; setExpandedOrder: (id: string | null) => void; copyKey: (c: string) => void;
}) {
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    fetch(`/api/orders?userId=${userId}`)
      .then(r => r.json())
      .then(data => { if (data.success) setOrders(data.orders || []); })
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
    fetch(`/api/auth/me`)
      .then(r => r.json())
      .then(data => { if (data.success && data.user) setUserPoints(data.user.points || 0); })
      .catch(() => {});
  }, [userId, setOrders]);

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((acc, o) => acc + o.total, 0);
  const totalKeys = orders.reduce((acc, o) => acc + o.items.reduce((a, i) => a + i.keys.length, 0), 0);
  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const stats = [
    { label: 'Total Orders', value: String(totalOrders), icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Keys Activated', value: String(totalKeys), icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Loyalty Points', value: `${userPoints} pts`, icon: Trophy, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative bg-[#0a0e1a] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#007cff]/[0.04] to-transparent pointer-events-none" />
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex flex-col gap-3">
            <span className="inline-flex items-center gap-1.5 bg-[#007cff]/10 text-[#007cff] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#007cff]/15 w-fit">
              <CheckCircle2 className="h-3 w-3" />
              Welcome back
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">{userName} <span className="inline-block animate-bounce">👋</span></h2>
              <p className="text-sm text-gray-500 mt-0.5">{userEmail}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ${totalSpent.toFixed(2)} spent
              </span>
              <span>·</span>
              <span>{totalOrders} orders</span>
              <span>·</span>
              <span>{totalKeys} keys</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#007cff]/30 to-blue-500/10 border border-[#007cff]/20 flex items-center justify-center shrink-0 shadow-lg shadow-[#007cff]/10">
            <span className="text-xl font-bold text-[#007cff]">{initials}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-[#0a0e1a] border border-white/[0.04] rounded-xl p-5 hover:border-white/[0.08] transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{s.label}</span>
                <div className={`p-2 rounded-lg ${s.bg} ${s.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
            </div>
          );
        })}
      </div>

      {/* Points & Rewards */}
      <div className="bg-[#0a0e1a] border border-cyan-500/10 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400"><Gift className="h-4 w-4" /></div>
            <div>
              <h3 className="text-sm font-semibold text-gray-200">Points & Rewards</h3>
              <p className="text-[11px] text-gray-600">Earn points with every purchase</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-cyan-400">{userPoints}</span>
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-3">
            {[
              { needed: 100, discount: '$5', desc: '5% off' },
              { needed: 250, discount: '$15', desc: '10% off' },
              { needed: 500, discount: '$35', desc: '15% off' },
            ].map(reward => (
              <div key={reward.needed} className={`flex-1 min-w-[140px] p-4 rounded-xl border transition-all ${userPoints >= reward.needed ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-[#04060a] border-white/[0.04] opacity-60'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className={`h-4 w-4 ${userPoints >= reward.needed ? 'text-cyan-400' : 'text-gray-600'}`} />
                  <span className={`text-sm font-bold ${userPoints >= reward.needed ? 'text-cyan-400' : 'text-gray-500'}`}>{reward.discount}</span>
                </div>
                <p className="text-xs text-gray-500">{reward.desc}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#04060a] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${userPoints >= reward.needed ? 'bg-cyan-400' : 'bg-gray-600'}`} style={{ width: `${Math.min((userPoints / reward.needed) * 100, 100)}%` }} />
                  </div>
                  <span className="text-[10px] font-medium text-gray-500">{userPoints}/{reward.needed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-[#0a0e1a] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400"><Clock className="h-4 w-4" /></div>
            <h3 className="text-sm font-semibold text-gray-200">Recent Orders</h3>
          </div>
          <Link href="#" onClick={() => {}} className="text-xs text-[#007cff] hover:text-[#007cff]/80 transition-colors font-medium">
            View all →
          </Link>
        </div>
        <div className="p-5">
          {loadingOrders ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 text-[#007cff] animate-spin" /></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 flex flex-col items-center gap-3">
              <Package className="h-8 w-8 text-gray-700" />
              <p className="text-sm text-gray-500">Order not found</p>
              <Link href="/" className="px-5 py-2 bg-[#007cff]/10 text-[#007cff] text-sm font-semibold rounded-lg border border-[#007cff]/20 hover:bg-[#007cff]/15 transition-all inline-flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Browse Store
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map(order => (
                <OrderCard key={order.id} order={order} expandedOrder={expandedOrder} setExpandedOrder={setExpandedOrder} copyKey={copyKey} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: ShoppingBag, title: 'Browse Store', desc: 'Find your next software', link: '/', color: 'text-blue-400', bg: 'bg-blue-500/10', badge: 'DEALS', badgeBg: 'bg-orange-500/90' },
          { icon: HelpCircle, title: 'Need Help?', desc: 'Contact support', link: '/', color: 'text-cyan-400', bg: 'bg-cyan-500/10', badge: 'Online', badgeBg: 'bg-emerald-500/90' },
          { icon: ShieldCheck, title: 'Secure Checkout', desc: 'SSL encrypted payments', link: '/', color: 'text-emerald-400', bg: 'bg-emerald-500/10', badge: 'Safe', badgeBg: 'bg-emerald-500/90' },
        ].map(a => {
          const Icon = a.icon;
          return (
            <Link key={a.title} href={a.link}
              className="bg-[#0a0e1a] border border-white/[0.04] rounded-xl p-5 hover:border-white/[0.08] transition-all group flex flex-col gap-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-lg ${a.bg} ${a.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-md ${a.badgeBg}`}>
                  {a.badge}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{a.title}</h4>
                <p className="text-xs text-gray-600 mt-0.5">{a.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ORDERS TAB
   ═══════════════════════════════════════════════════ */
function OrdersTab({ userId, expandedOrder, setExpandedOrder, copyKey }: {
  userId: string; expandedOrder: string | null; setExpandedOrder: (id: string | null) => void; copyKey: (c: string) => void;
}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders?userId=${userId}`)
      .then(r => r.json())
      .then(data => { if (data.success) setOrders(data.orders || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 text-[#007cff] animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">My Orders</h2>
        <span className="text-xs text-gray-600 bg-[#0a0e1a] px-3 py-1.5 rounded-lg border border-white/[0.04]">
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[#0a0e1a] border border-white/[0.04] p-10 rounded-xl text-center flex flex-col items-center gap-3">
          <Package className="h-8 w-8 text-gray-700" />
          <p className="text-sm text-gray-500">Aún no has realizado ninguna compra.</p>
          <Link href="/" className="mt-2 px-5 py-2 bg-[#007cff]/10 text-[#007cff] text-sm font-semibold rounded-lg border border-[#007cff]/20 hover:bg-[#007cff]/15 transition-all">
            Explorar productos →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} expandedOrder={expandedOrder} setExpandedOrder={setExpandedOrder} copyKey={copyKey} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SETTINGS TAB
   ═══════════════════════════════════════════════════ */
function SettingsTab({ userName, userEmail, logout }: { userName: string; userEmail: string; logout: () => void }) {
  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">Settings</h2>

      {/* Profile Card */}
      <div className="bg-[#0a0e1a] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#007cff]/10 text-[#007cff]"><User className="h-4 w-4" /></div>
          <h3 className="text-sm font-semibold text-gray-200">Profile Information</h3>
        </div>
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#007cff]/30 to-blue-500/10 border border-[#007cff]/20 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-[#007cff]">{initials}</span>
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Name</label>
              <p className="text-sm font-medium text-gray-200">{userName}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Email</label>
              <p className="text-sm font-medium text-gray-200">{userEmail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-[#0a0e1a] border border-white/[0.04] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><ShieldCheck className="h-4 w-4" /></div>
          <h3 className="text-sm font-semibold text-gray-200">Security</h3>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
            <div className="flex items-center gap-3">
              <Lock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-200">Password</p>
                <p className="text-xs text-gray-600">Last changed: Never</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-200">Two-Factor Auth</p>
                <p className="text-xs text-gray-600">Not enabled</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#0a0e1a] border border-red-500/10 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-red-500/10 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400"><LogOut className="h-4 w-4" /></div>
          <h3 className="text-sm font-semibold text-gray-200">Session</h3>
        </div>
        <div className="p-6">
          <button onClick={logout}
            className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold rounded-lg border border-red-500/15 transition-all cursor-pointer flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ORDER CARD
   ═══════════════════════════════════════════════════ */
function OrderCard({ order, expandedOrder, setExpandedOrder, copyKey }: {
  order: Order; expandedOrder: string | null; setExpandedOrder: (id: string | null) => void; copyKey: (c: string) => void;
}) {
  const isExpanded = expandedOrder === order.id;

  return (
    <div className="bg-[#0a0e1a] border border-white/[0.04] rounded-xl overflow-hidden hover:border-white/[0.08] transition-all">
      <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#007cff]/10 flex items-center justify-center shrink-0">
            <ShoppingBag className="h-4 w-4 text-[#007cff]" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-gray-200">{order.customerName}</span>
            <span className="text-[11px] text-gray-600 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(order.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-emerald-400">${order.total.toFixed(2)}</span>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">{order.status}</span>
          {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-600" />}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-white/[0.04] px-5 py-4 flex flex-col gap-4">
          {order.items.map((item) => (
            <div key={item.id} className="bg-[#04060a] rounded-lg p-4 border border-white/[0.04]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-[#007cff]" />
                  <Link href={`/product/${item.product.slug}`} className="text-sm font-medium text-gray-200 hover:text-[#007cff] transition-colors flex items-center gap-1">
                    {item.product.title} <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
                <span className="text-xs text-gray-600">×{item.quantity}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Keys de Activación:</p>
                {item.keys.map((keyItem, kidx) => (
                  <div key={kidx} className="flex items-center justify-between bg-[#0a0e1a] rounded-lg px-3 py-2 border border-white/[0.04]">
                    <code className="text-xs font-mono font-semibold text-cyan-400">{keyItem.code}</code>
                    <button onClick={() => copyKey(keyItem.code)}
                      className="text-gray-600 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/[0.04]" title="Copiar clave">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

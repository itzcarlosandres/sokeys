"use client";

import React, { useState, useEffect, useMemo } from 'react';
import SafeImage from '@/components/SafeImage';
import { createProduct, addKeysToProduct, updateProduct, deleteProduct, deleteKey, adminLogin, adminVerify, adminLogout, adminRegister, toggleProductField } from '@/app/actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, Key, ShoppingCart, Users, User,
  LogOut, Plus, Edit3, Trash2, Search, X, ChevronDown, ChevronUp,
  Menu, PanelLeftClose,
  Copy, ExternalLink, Loader2, CheckCircle2, AlertTriangle,
  ShieldAlert, Lock, Eye, EyeOff, DollarSign, Clock, TrendingUp,
  Mail, ListFilter, Sparkles, ChevronLeft, Hexagon, Star, Tag, Home, Trophy, Percent,
  Monitor, Award, ShieldCheck, Zap, HardDrive, Server, Gamepad2, Globe, Cpu, Database, Code, Bug, Shield, Save, Gift
} from 'lucide-react';

interface ProductItem {
  id: string; title: string; slug: string; price: number; platform: string;
  region: string; image: string; bannerImage?: string | null; originalPrice: number | null;
  genre: string; type: string; isFeatured: boolean; isHot: boolean; isRecent: boolean; isPopular: boolean;
  isBestSeller: boolean; isOnSale: boolean; description: string;
  _count?: { keys: number; orderItems: number } | any; keys?: any[];
}

interface AdminPanelProps {
  products: ProductItem[];
  stats: { totalProducts: number; activeKeys: number; salesCount: number; totalRevenue: number; soldKeys: number };
  orders: any[]; customers: { email: string; orderCount: number; totalSpent: number; lastOrder: string }[];
  allKeys: any[];
  topProducts: { productId: string; quantity: number; revenue: number; product: { title: string; slug: string; image: string } | null }[];
}

type TabId = 'dashboard' | 'products' | 'design' | 'platforms' | 'badges' | 'rewards' | 'keys' | 'orders' | 'customers' | 'settings';

const NAV = [
  { id: 'dashboard' as TabId, label: 'Panel', subtitle: 'Visión general', icon: LayoutDashboard },
  { id: 'products' as TabId, label: 'Productos', subtitle: 'Catálogo y stock', icon: Package },
  { id: 'design' as TabId, label: 'Diseño', subtitle: 'Secciones del home', icon: Home },
  { id: 'platforms' as TabId, label: 'Plataformas', subtitle: 'Gestionar plataformas', icon: Monitor },
  { id: 'badges' as TabId, label: 'Badges', subtitle: 'Insignias de producto', icon: Award },
  { id: 'rewards' as TabId, label: 'Rewards', subtitle: 'Puntos y cupones', icon: Gift },
  { id: 'keys' as TabId, label: 'Claves', subtitle: 'Licencias y códigos', icon: Key },
  { id: 'orders' as TabId, label: 'Pedidos', subtitle: 'Historial de ventas', icon: ShoppingCart },
  { id: 'customers' as TabId, label: 'Clientes', subtitle: 'Base de compradores', icon: Users },
  { id: 'settings' as TabId, label: 'Configuración', subtitle: 'SEO, tienda y general', icon: Shield },
];

const NAV_ICONS: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard, products: Package, design: Home, platforms: Monitor, badges: Award, rewards: Gift, keys: Key, orders: ShoppingCart, customers: Users, settings: Shield,
};

export default function AdminPanel({ products, stats, orders, customers, allKeys, topProducts }: AdminPanelProps) {
  const router = useRouter();
  const [isAuthed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [logging, setLogging] = useState(false);
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [tab, setTab] = useState<TabId>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editP, setEditP] = useState<ProductItem | null>(null);
  const [ft, setFt] = useState(''); const [fs, setFs] = useState(''); const [fd, setFd] = useState('');
  const [fp, setFp] = useState(''); const [fop, setFop] = useState(''); const [fi, setFi] = useState('');
  const [fbi, setFbi] = useState(''); const [fpl, setFpl] = useState('Windows'); const [fr, setFr] = useState('GLOBAL');
  const [fty, setFty] = useState('Software'); const [fg, setFg] = useState('');
  const [ffeat, setFfeat] = useState(false); const [fhot, setFhot] = useState(false); const [frecent, setFrecent] = useState(false); const [fpopular, setFpopular] = useState(false); const [fkeys, setFkeys] = useState('');

  const [selProd, setSelProd] = useState(products[0]?.id || '');
  const [addKeysText, setAddKeysText] = useState('');
  const [showAddKeys, setShowAddKeys] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [keySearch, setKeySearch] = useState('');
  const [keyProdFilter, setKeyProdFilter] = useState('all');
  const [keyStatus, setKeyStatus] = useState<'all' | 'sold' | 'available'>('all');
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmType, setConfirmType] = useState<'product' | 'key' | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [toggling, setToggling] = useState<string | null>(null);
  const [showRegAdmin, setShowRegAdmin] = useState(false);
  const [regUser, setRegUser] = useState('');
  const [regPass, setRegPass] = useState('');

  const [homeColumns, setHomeColumns] = useState(4);
  const [homeFeaturedCount, setHomeFeaturedCount] = useState(8);
  const [catalogColumns, setCatalogColumns] = useState(4);
  const [savingDesign, setSavingDesign] = useState(false);

  const [platforms, setPlatforms] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showPlatformForm, setShowPlatformForm] = useState(false);
  const [showBadgeForm, setShowBadgeForm] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editPlatform, setEditPlatform] = useState<any | null>(null);
  const [editBadge, setEditBadge] = useState<any | null>(null);
  const [editCoupon, setEditCoupon] = useState<any | null>(null);
  const [pfName, setPfName] = useState(''); const [pfIcon, setPfIcon] = useState('Monitor'); const [pfColor, setPfColor] = useState('text-blue-400'); const [pfBg, setPfBg] = useState('bg-blue-500/10');
  const [bfName, setBfName] = useState(''); const [bfIcon, setBfIcon] = useState('Star'); const [bfColor, setBfColor] = useState('text-amber-400'); const [bfBg, setBfBg] = useState('bg-amber-500/10'); const [bfBorder, setBfBorder] = useState('border-amber-500/20');
  const [cfCode, setCfCode] = useState(''); const [cfType, setCfType] = useState('percent'); const [cfValue, setCfValue] = useState(''); const [cfPoints, setCfPoints] = useState(''); const [cfExpires, setCfExpires] = useState('');
  const [pointsPerDollar, setPointsPerDollar] = useState(10);

  // Settings states
  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [siteKeywords, setSiteKeywords] = useState('');
  const [ogImageUrl, setOgImageUrl] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [supportEmail, setSupportEmail] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [cashbackEnabled, setCashbackEnabled] = useState(false);
  const [cashbackPercent, setCashbackPercent] = useState(0);
  const [savingSettings, setSavingSettings] = useState(false);

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };
  const money = (n: number) => `$${n.toFixed(2)}`;

  useEffect(() => {
    const token = localStorage.getItem('pixelcodes_admin_token');
    if (!token) { setChecking(false); return; }
    adminVerify(token).then(r => {
      if (r.success) { setAuthed(true); if (r.admin) setAdminName(r.admin.username); }
      else localStorage.removeItem('pixelcodes_admin_token');
      setChecking(false);
    });
  }, []);

  useEffect(() => {
    if (tab === 'design') {
      fetch('/api/config').then(r => r.json()).then(data => {
        if (data.success && data.config) {
          setHomeColumns(data.config.homeColumns);
          setHomeFeaturedCount(data.config.homeFeaturedCount);
          setCatalogColumns(data.config.catalogColumns);
        }
      });
    }
    if (tab === 'platforms') {
      fetch('/api/platforms').then(r => r.json()).then(data => {
        if (data.success) setPlatforms(data.platforms);
      });
    }
    if (tab === 'badges') {
      fetch('/api/badges').then(r => r.json()).then(data => {
        if (data.success) setBadges(data.badges);
      });
    }
    if (tab === 'rewards') {
      fetch('/api/coupons').then(r => r.json()).then(data => {
        if (data.success) setCoupons(data.coupons || []);
      });
      fetch('/api/config').then(r => r.json()).then(data => {
        if (data.success && data.config) setPointsPerDollar(data.config.pointsPerDollar || 10);
      });
    }
    if (tab === 'settings') {
      fetch('/api/config').then(r => r.json()).then(data => {
        if (data.success && data.config) {
          const c = data.config;
          setSiteName(c.siteName || '');
          setSiteDescription(c.siteDescription || '');
          setSiteKeywords(c.siteKeywords || '');
          setOgImageUrl(c.ogImageUrl || '');
          setSiteUrl(c.siteUrl || '');
          setCurrencyCode(c.currencyCode || 'USD');
          setCurrencySymbol(c.currencySymbol || '$');
          setSupportEmail(c.supportEmail || '');
          setLogoUrl(c.logoUrl || '');
          setCashbackEnabled(c.cashbackEnabled || false);
          setCashbackPercent(c.cashbackPercent || 0);
          setHomeColumns(c.homeColumns || 4);
          setHomeFeaturedCount(c.homeFeaturedCount || 8);
          setCatalogColumns(c.catalogColumns || 4);
          setPointsPerDollar(c.pointsPerDollar || 10);
        }
      });
    }
  }, [tab]);

  const handleSaveDesign = async () => {
    setSavingDesign(true);
    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ homeColumns, homeFeaturedCount, catalogColumns }),
    });
    const data = await res.json();
    if (data.success) {
      setFeedback({ success: true, message: 'Configuración guardada.' });
    } else {
      setFeedback({ success: false, message: data.error || 'Error al guardar.' });
    }
    setSavingDesign(false);
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        siteName, siteDescription, siteKeywords, ogImageUrl, siteUrl,
        currencyCode, currencySymbol, supportEmail, logoUrl,
        cashbackEnabled, cashbackPercent,
        pointsPerDollar, homeColumns, homeFeaturedCount, catalogColumns,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setFeedback({ success: true, message: 'Configuración guardada correctamente.' });
    } else {
      setFeedback({ success: false, message: data.error || 'Error al guardar.' });
    }
    setSavingSettings(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoginErr(''); setLogging(true);
    try {
      const r = await adminLogin(loginUser, loginPass);
      if (r.success && r.token) {
        localStorage.setItem('pixelcodes_admin_token', r.token);
        setAuthed(true); setAdminName(loginUser); setLoginUser(''); setLoginPass('');
      } else setLoginErr(r.error || 'Credenciales inválidas.');
    } catch { setLoginErr('Error de conexión.'); }
    setLogging(false);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('pixelcodes_admin_token');
    if (token) await adminLogout(token);
    localStorage.removeItem('pixelcodes_admin_token');
    setAuthed(false); setFeedback(null); setAdminName('');
  };

  const handleRegAdmin = async (e: React.FormEvent) => {
    e.preventDefault(); if (!regUser || !regPass) return;
    const r = await adminRegister(regUser, regPass);
    if (r.success) { setFeedback({ success: true, message: `Admin "${regUser}" creado.` }); setRegUser(''); setRegPass(''); setShowRegAdmin(false); }
    else setFeedback({ success: false, message: r.error || 'Error.' });
  };

  const resetForm = () => { setFt(''); setFs(''); setFd(''); setFp(''); setFop(''); setFi(''); setFbi(''); setFpl('Windows'); setFr('GLOBAL'); setFty('Software'); setFg(''); setFfeat(false); setFhot(false); setFrecent(false); setFpopular(false); setFkeys(''); };
  const openEdit = (p: ProductItem) => {
    setEditP(p); setFt(p.title); setFs(p.slug); setFd(p.description); setFp(String(p.price));
    setFop(p.originalPrice ? String(p.originalPrice) : ''); setFi(p.image); setFbi(p.bannerImage || '');
    setFpl(p.platform); setFr(p.region); setFty(p.type); setFg(p.genre); setFfeat(p.isFeatured); setFhot(p.isHot); setFrecent(p.isRecent); setFpopular(p.isPopular);
    setFkeys(''); setFeedback(null); setShowForm(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault(); setFeedback(null); setSubmitting(true);
    try {
      const payload = { title: ft, slug: fs.trim() || undefined, description: fd, price: Number(fp), originalPrice: fop ? Number(fop) : null, image: fi, bannerImage: fbi || null, platform: fpl, region: fr, type: fty, genre: fg, isFeatured: ffeat, isHot: fhot, isRecent: frecent, isPopular: fpopular };
      let res;
      if (editP) {
        res = await updateProduct(editP.id, payload);
        if (res.success) { setFeedback({ success: true, message: `"${ft}" actualizado.` }); setEditP(null); resetForm(); setShowForm(false); router.refresh(); }
      } else {
        res = await createProduct({ ...payload, keysText: fkeys });
        if (res.success) { setFeedback({ success: true, message: `"${ft}" creado.` }); resetForm(); router.refresh(); }
      }
      if (res && !res.success) setFeedback({ success: false, message: res.error || 'Error.' });
    } catch (err: any) { setFeedback({ success: false, message: err.message }); }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    const res = confirmType === 'product' ? await deleteProduct(confirmId) : await deleteKey(confirmId);
    if (res.success) { setFeedback({ success: true, message: 'Eliminado.' }); router.refresh(); }
    else setFeedback({ success: false, message: res.error || 'Error.' });
    setConfirmId(null); setConfirmType(null);
  };

  const handleAddKeys = async (e: React.FormEvent) => {
    e.preventDefault(); setFeedback(null); setSubmitting(true);
    const res = await addKeysToProduct(selProd, addKeysText);
    if (res.success && res.count) { setFeedback({ success: true, message: `${res.count} claves agregadas.` }); setAddKeysText(''); router.refresh(); }
    else setFeedback({ success: false, message: res.error || 'Error.' });
    setSubmitting(false);
  };

  const handleToggle = async (productId: string, field: 'isRecent' | 'isPopular' | 'isFeatured' | 'isHot' | 'isBestSeller' | 'isOnSale') => {
    setToggling(productId + field);
    const res = await toggleProductField(productId, field);
    if (res.success) {
      const labels: Record<string, string> = { isRecent: 'Reciente', isPopular: 'Popular', isFeatured: 'Destacado', isHot: 'Hot Deal', isBestSeller: 'Best Seller', isOnSale: 'En Oferta' };
      setFeedback({ success: true, message: `${labels[field]} ${res.value ? 'activado' : 'desactivado'}.` });
      router.push('/admin', { scroll: false });
    } else {
      setFeedback({ success: false, message: res.error || 'Error.' });
    }
    setToggling(null);
  };

  const filteredKeys = useMemo(() => allKeys.filter((k: any) => {
    if (keyProdFilter !== 'all' && k.productId !== keyProdFilter) return false;
    if (keyStatus === 'sold' && !k.isSold) return false;
    if (keyStatus === 'available' && k.isSold) return false;
    if (keySearch && !k.code.toLowerCase().includes(keySearch.toLowerCase()) && !k.product?.title.toLowerCase().includes(keySearch.toLowerCase())) return false;
    return true;
  }), [allKeys, keyProdFilter, keyStatus, keySearch]);

  const statCards = [
    { label: 'Ingresos', value: money(stats.totalRevenue), color: 'text-emerald-400', icon: DollarSign, gradient: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/10' },
    { label: 'Ventas', value: String(stats.salesCount), color: 'text-orange-400', icon: ShoppingCart, gradient: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-500/10' },
    { label: 'Productos', value: String(stats.totalProducts), color: 'text-blue-400', icon: Package, gradient: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/10' },
    { label: 'Keys Stock', value: String(stats.activeKeys), color: 'text-cyan-400', icon: Key, gradient: 'from-cyan-500/20 to-cyan-500/5', border: 'border-cyan-500/10' },
    { label: 'Keys Vend.', value: String(stats.soldKeys), color: 'text-purple-400', icon: CheckCircle2, gradient: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/10' },
    { label: 'Clientes', value: String(customers.length), color: 'text-indigo-400', icon: Users, gradient: 'from-indigo-500/20 to-indigo-500/5', border: 'border-indigo-500/10' },
  ];

  // ─── LOADING ───
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#04060a]">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#007cff] to-blue-600 animate-pulse" />
            <Loader2 className="h-5 w-5 text-white animate-spin absolute inset-0 m-auto" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Cargando consola...</p>
        </div>
      </div>
    );
  }

  // ─── LOGIN ───
  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#04060a]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#007cff]/[0.03] rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-purple-500/[0.02] rounded-full blur-[80px]" />
        </div>

        <div className="w-full max-w-sm relative">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#007cff]/20 to-blue-500/5 border border-[#007cff]/20 mb-5 shadow-lg shadow-[#007cff]/5">
              <Hexagon className="h-6 w-6 text-[#007cff]" />
            </div>
            <h1 className="text-xl font-semibold text-white tracking-tight">PixelCodes</h1>
            <p className="text-sm text-gray-500 mt-1.5">Acceso administrativo privado</p>
          </div>

          <div className="relative">
            <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.06] to-transparent rounded-2xl pointer-events-none" />
            <div className="relative bg-[#0a0e1a] rounded-2xl p-7 border border-white/[0.04] shadow-2xl">
              {loginErr && (
                <div className="mb-5 bg-red-500/10 border border-red-500/15 text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2.5">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{loginErr}</span>
                </div>
              )}
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                    <input type="text" required value={loginUser} onChange={e => setLoginUser(e.target.value)}
                      placeholder="Ingresa tu usuario" autoComplete="username"
                      className="w-full bg-[#04060a] text-sm text-gray-200 pl-10 pr-3.5 py-2.5 rounded-xl border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 focus:ring-1 focus:ring-[#007cff]/20 transition-all placeholder:text-gray-700" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                    <input type={showLoginPass ? 'text' : 'password'} required value={loginPass} onChange={e => setLoginPass(e.target.value)}
                      placeholder="••••••••" autoComplete="current-password"
                      className="w-full bg-[#04060a] text-sm text-gray-200 pl-10 pr-10 py-2.5 rounded-xl border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 focus:ring-1 focus:ring-[#007cff]/20 transition-all placeholder:text-gray-700" />
                    <button type="button" onClick={() => setShowLoginPass(!showLoginPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors cursor-pointer">
                      {showLoginPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={logging}
                  className="w-full py-2.5 bg-gradient-to-r from-[#007cff] to-blue-600 hover:from-[#007cff] hover:to-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all cursor-pointer shadow-lg shadow-[#007cff]/10 mt-1">
                  {logging ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Acceder al panel'}
                </button>
              </form>
              <div className="mt-5 pt-4 border-t border-white/[0.04] text-center">
                <p className="text-xs text-gray-600">
                  Demo: <span className="text-gray-400 font-mono bg-[#04060a] px-2 py-0.5 rounded border border-white/[0.04]">admin</span>
                  {' / '}
                  <span className="text-gray-400 font-mono bg-[#04060a] px-2 py-0.5 rounded border border-white/[0.04]">admin2026</span>
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors inline-flex items-center gap-1.5">
              <ChevronLeft className="h-3 w-3" />
              Volver a la tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── SIDEBAR ───
  return (
    <div className="flex min-h-screen bg-[#04060a]">

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-60'} fixed lg:sticky inset-y-0 left-0 z-50 lg:z-auto transition-transform duration-300 lg:transition-all flex flex-col bg-[#080c18] border-r border-white/[0.04] relative shrink-0 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Sidebar gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#007cff]/[0.02] to-transparent pointer-events-none" />

        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/[0.04] relative">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#007cff] to-blue-600 flex items-center justify-center shadow-lg shadow-[#007cff]/20 shrink-0">
            <Hexagon className="h-4 w-4 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white tracking-tight">Pixel<span className="text-[#007cff]">Codes</span></span>
              <span className="text-[10px] text-gray-600 font-medium uppercase tracking-wider">Admin Console</span>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="ml-auto hidden lg:block text-gray-600 hover:text-gray-400 transition-colors cursor-pointer">
            <ChevronLeft className={`h-4 w-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
          <button onClick={() => setMobileSidebarOpen(false)}
            className="ml-auto lg:hidden p-1.5 text-gray-500 hover:text-gray-200 hover:bg-white/[0.04] rounded-lg transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2.5 space-y-0.5 relative overflow-y-auto">
          {NAV.map(item => {
            const active = tab === item.id;
            const Icon = NAV_ICONS[item.id];
            return (
              <button key={item.id} onClick={() => { setTab(item.id); setMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer relative group ${
                  active
                    ? 'bg-gradient-to-r from-[#007cff]/10 to-transparent text-[#007cff]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
                }`}>
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-[#007cff]" />}
                <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                  active ? 'bg-[#007cff]/15 text-[#007cff]' : 'text-gray-500 group-hover:text-gray-300'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                {!sidebarCollapsed && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-[10px] text-gray-600 font-normal">{item.subtitle}</span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="relative border-t border-white/[0.04] px-2.5 py-3 space-y-1">
          <button onClick={() => setShowRegAdmin(!showRegAdmin)}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              showRegAdmin ? 'bg-red-500/10 text-red-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
            }`}>
            <div className="p-1.5 rounded-lg"><User className="h-4 w-4" /></div>
            {!sidebarCollapsed && <span>{showRegAdmin ? 'Cancelar' : 'Nuevo Admin'}</span>}
          </button>

          <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${!sidebarCollapsed ? '' : 'justify-center'}`}>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#007cff]/30 to-blue-500/10 border border-[#007cff]/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-[#007cff]">{adminName?.charAt(0).toUpperCase() || 'A'}</span>
            </div>
            {!sidebarCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{adminName || 'Admin'}</p>
                  <p className="text-[10px] text-gray-600">Administrador</p>
                </div>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer p-1" title="Cerrar sesión">
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-white/[0.04] bg-[#080c18]/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu toggle */}
            <button onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 text-gray-400 hover:text-gray-200 hover:bg-white/[0.04] rounded-lg transition-colors cursor-pointer shrink-0">
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2.5 min-w-0">
              {React.createElement(NAV_ICONS[tab], { className: 'h-5 w-5 text-[#007cff] shrink-0' })}
              <h1 className="text-base font-semibold text-white truncate">{NAV.find(n => n.id === tab)?.label}</h1>
            </div>
            {feedback && (
              <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                feedback.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' : 'bg-red-500/10 text-red-400 border border-red-500/10'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${feedback.success ? 'bg-emerald-400' : 'bg-red-400'}`} />
                <span className="truncate max-w-[160px]">{feedback.message}</span>
                <button onClick={() => setFeedback(null)} className="ml-1 opacity-50 hover:opacity-100 cursor-pointer shrink-0"><X className="h-3 w-3" /></button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors inline-flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.04]">
              <span>Tienda</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </header>

        {/* Mobile feedback banner */}
        {feedback && (
          <div className={`sm:hidden flex items-center gap-2 px-4 py-2.5 border-b text-xs font-medium ${
            feedback.success ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' : 'bg-red-500/10 text-red-400 border-red-500/10'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${feedback.success ? 'bg-emerald-400' : 'bg-red-400'}`} />
            <span className="flex-1 truncate">{feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="opacity-50 hover:opacity-100 cursor-pointer shrink-0"><X className="h-3 w-3" /></button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* Admin Register Form */}
            {showRegAdmin && (
              <div className="relative">
                <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.04] to-transparent rounded-xl pointer-events-none" />
                <form onSubmit={handleRegAdmin} className="relative bg-[#0a0e1a] rounded-xl p-4 border border-white/[0.04] flex flex-wrap items-center gap-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0">Nuevo Administrador</span>
                  <input type="text" required value={regUser} onChange={e => setRegUser(e.target.value)} placeholder="Nombre de usuario"
                    className="flex-1 min-w-[140px] bg-[#04060a] text-sm text-gray-200 px-3.5 py-2 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 placeholder:text-gray-700" />
                  <input type="password" required value={regPass} onChange={e => setRegPass(e.target.value)} placeholder="Contraseña"
                    className="flex-1 min-w-[140px] bg-[#04060a] text-sm text-gray-200 px-3.5 py-2 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 placeholder:text-gray-700" />
                  <button type="submit" className="px-5 py-2 bg-gradient-to-r from-[#007cff] to-blue-600 hover:from-[#007cff] hover:to-blue-500 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-lg shadow-[#007cff]/10">
                    Crear Admin
                  </button>
                </form>
              </div>
            )}

            {/* ─── DASHBOARD ─── */}
            {tab === 'dashboard' && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  {statCards.map(s => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className={`relative bg-[#0a0e1a] rounded-xl p-5 border ${s.border} overflow-hidden group hover:border-white/[0.08] transition-all duration-300`}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
                        <div className="relative">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{s.label}</span>
                            <div className={`p-2 rounded-lg ${s.color} bg-white/[0.03] border border-white/[0.04]`}>
                              <Icon className="h-4 w-4" />
                            </div>
                          </div>
                          <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Products */}
                  <div className="bg-[#0a0e1a] rounded-xl border border-white/[0.04] overflow-hidden hover:border-white/[0.06] transition-all duration-300">
                    <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400"><TrendingUp className="h-4 w-4" /></div>
                      <h3 className="text-sm font-semibold text-gray-200">Más Vendidos</h3>
                    </div>
                    <div className="p-5 space-y-3">
                      {topProducts.length === 0 ? (
                        <p className="text-sm text-gray-600 text-center py-4">Aún no hay ventas registradas.</p>
                      ) : topProducts.map((tp, i) => (
                        <div key={tp.productId} className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors">
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            i === 0 ? 'bg-amber-500/15 text-amber-400' : i === 1 ? 'bg-gray-400/10 text-gray-400' : i === 2 ? 'bg-orange-500/10 text-orange-400' : 'bg-white/[0.04] text-gray-600'
                          }`}>
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-200 truncate">{tp.product?.title || '-'}</p>
                            <p className="text-xs text-gray-600">{tp.quantity} vendido{tp.quantity !== 1 ? 's' : ''}</p>
                          </div>
                          <span className="text-sm font-semibold text-emerald-400">{money(tp.revenue)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-[#0a0e1a] rounded-xl border border-white/[0.04] overflow-hidden hover:border-white/[0.06] transition-all duration-300">
                    <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-[#007cff]/10 text-[#007cff]"><Sparkles className="h-4 w-4" /></div>
                      <h3 className="text-sm font-semibold text-gray-200">Acciones Rápidas</h3>
                    </div>
                    <div className="p-5 grid grid-cols-2 gap-3">
                      {[
                        { label: 'Nuevo Producto', icon: Plus, action: () => { setShowForm(true); setEditP(null); resetForm(); setTab('products'); }, gradient: 'from-blue-500/20 to-blue-500/5', color: 'text-blue-400' },
                        { label: 'Agregar Keys', icon: Key, action: () => { setShowAddKeys(true); setTab('products'); }, gradient: 'from-cyan-500/20 to-cyan-500/5', color: 'text-cyan-400' },
                        { label: 'Ver Pedidos', icon: ShoppingCart, action: () => setTab('orders'), gradient: 'from-orange-500/20 to-orange-500/5', color: 'text-orange-400' },
                        { label: 'Clientes', icon: Users, action: () => setTab('customers'), gradient: 'from-indigo-500/20 to-indigo-500/5', color: 'text-indigo-400' },
                      ].map(a => {
                        const Icon = a.icon;
                        return (
                          <button key={a.label} onClick={a.action}
                            className="flex items-center gap-3 p-3.5 bg-[#04060a] border border-white/[0.04] rounded-xl hover:border-white/[0.08] hover:bg-[#04060a]/80 transition-all duration-200 text-left cursor-pointer group">
                            <div className={`p-2.5 rounded-lg bg-gradient-to-br ${a.gradient} border border-white/[0.04] group-hover:scale-105 transition-transform`}>
                              <Icon className={`h-4 w-4 ${a.color}`} />
                            </div>
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{a.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-[#0a0e1a] rounded-xl border border-white/[0.04] overflow-hidden hover:border-white/[0.06] transition-all duration-300">
                  <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400"><Clock className="h-4 w-4" /></div>
                      <h3 className="text-sm font-semibold text-gray-200">Pedidos Recientes</h3>
                    </div>
                    <button onClick={() => setTab('orders')} className="text-xs text-gray-500 hover:text-gray-300 transition-colors cursor-pointer bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.04]">
                      Ver todos →
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs text-gray-600 border-b border-white/[0.04]">
                          <th className="text-left font-semibold py-3.5 px-6">Cliente</th>
                          <th className="text-left font-semibold py-3.5 px-6">Email</th>
                          <th className="text-right font-semibold py-3.5 px-6">Total</th>
                          <th className="text-right font-semibold py-3.5 px-6">Fecha</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {orders.slice(0, 5).map((o: any, i: number) => (
                          <tr key={o.id} className={`text-sm transition-colors hover:bg-white/[0.02] ${i === 0 ? '' : ''}`}>
                            <td className="py-3.5 px-6 text-gray-200 font-medium">{o.customerName}</td>
                            <td className="py-3.5 px-6 text-gray-500">{o.customerEmail}</td>
                            <td className="py-3.5 px-6 text-right font-semibold text-emerald-400">{money(o.total)}</td>
                            <td className="py-3.5 px-6 text-right text-gray-500 text-xs">{fmtDate(o.createdAt)}</td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr><td colSpan={4} className="py-8 text-center text-sm text-gray-600">No hay pedidos registrados.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ─── PRODUCTS ─── */}
            {tab === 'products' && (
              <>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setShowForm(!showForm); if (!showForm) { setEditP(null); resetForm(); } }}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 cursor-pointer ${
                      showForm ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-[#007cff]/10 border-[#007cff]/20 text-[#007cff] hover:bg-[#007cff]/15'
                    }`}>
                    {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {showForm ? 'Cerrar' : 'Nuevo Producto'}
                  </button>
                  <button onClick={() => setShowAddKeys(!showAddKeys)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 cursor-pointer ${
                      showAddKeys ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/15'
                    }`}>
                    <Key className="h-4 w-4" />
                    {showAddKeys ? 'Cerrar' : 'Agregar Keys'}
                  </button>
                </div>

                {/* Add Keys Form */}
                {showAddKeys && (
                  <div className="relative">
                    <div className="absolute -inset-[1px] bg-gradient-to-b from-cyan-500/[0.04] to-transparent rounded-xl pointer-events-none" />
                    <form onSubmit={handleAddKeys} className="relative bg-[#0a0e1a] rounded-xl p-6 border border-white/[0.04] space-y-4">
                      <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                        <Key className="h-4 w-4 text-cyan-400" />
                        Agregar Claves de Activación
                      </h3>
                      <select required value={selProd} onChange={e => setSelProd(e.target.value)}
                        className="w-full bg-[#04060a] text-sm text-gray-300 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40">
                        <option value="" disabled>Seleccionar producto</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.title} ({p.platform})</option>)}
                      </select>
                      <textarea required rows={4} value={addKeysText} onChange={e => setAddKeysText(e.target.value)}
                        placeholder="XXXXX-XXXXX-XXXXX-XXXXX&#10;YYYYY-YYYYY-YYYYY-YYYYY"
                        className="w-full bg-[#04060a] text-sm font-mono text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 placeholder:text-gray-700" />
                      <button type="submit" disabled={submitting}
                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white text-sm font-semibold rounded-lg transition-all cursor-pointer shadow-lg shadow-cyan-500/10">
                        {submitting ? 'Agregando...' : 'Agregar Claves'}
                      </button>
                    </form>
                  </div>
                )}

                {/* Create/Edit Form */}
                {showForm && (
                  <div className="relative">
                    <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.04] to-transparent rounded-xl pointer-events-none" />
                    <form onSubmit={handleSaveProduct} className="relative bg-[#0a0e1a] rounded-xl p-6 border border-white/[0.04] space-y-5">
                      <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                        {editP ? <Edit3 className="h-4 w-4 text-amber-400" /> : <Plus className="h-4 w-4 text-[#007cff]" />}
                        {editP ? `Editando: ${editP.title}` : 'Nuevo Producto'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" required value={ft} onChange={e => setFt(e.target.value)} placeholder="Título del producto"
                          className="bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 placeholder:text-gray-700" />
                        <input type="text" value={fs} onChange={e => setFs(e.target.value)} placeholder="Slug (opcional)"
                          className="bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 placeholder:text-gray-700" />
                        <textarea required rows={2} value={fd} onChange={e => setFd(e.target.value)} placeholder="Descripción del producto"
                          className="md:col-span-2 bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 placeholder:text-gray-700" />
                        <input type="number" step="0.01" required value={fp} onChange={e => setFp(e.target.value)} placeholder="Precio de venta ($)"
                          className="bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 placeholder:text-gray-700" />
                        <input type="number" step="0.01" value={fop} onChange={e => setFop(e.target.value)} placeholder="Precio original ($)"
                          className="bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 placeholder:text-gray-700" />
                        <div className="bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus-within:border-[#007cff]/40">
                          <label className="text-xs text-gray-500 font-medium mb-1.5 block">Imagen del producto</label>
                          <input type="file" accept="image/*" onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => setFi(ev.target?.result as string);
                              reader.readAsDataURL(file);
                            }
                          }} className="w-full text-gray-400 text-xs file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#007cff]/10 file:text-[#007cff] hover:file:bg-[#007cff]/20 cursor-pointer" />
                          {fi && <div className="relative mt-2 w-20 h-12 rounded-lg overflow-hidden border border-white/[0.06]"><SafeImage src={fi} alt="preview" fill sizes="80px" className="object-cover" /></div>}
                        </div>
                        <input type="text" value={fbi} onChange={e => setFbi(e.target.value)} placeholder="URL de banner (opcional)"
                          className="bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 placeholder:text-gray-700" />
                        <select value={fpl} onChange={e => setFpl(e.target.value)}
                          className="bg-[#04060a] text-sm text-gray-300 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40">
                          <option value="Windows">Windows / Microsoft</option>
                          <option value="Office">Office</option>
                          <option value="Security">Antivirus / Seguridad</option>
                          <option value="Server">Servidor</option>
                          <option value="Steam">Steam</option>
                          <option value="Other">Otra</option>
                        </select>
                        <select value={fr} onChange={e => setFr(e.target.value)}
                          className="bg-[#04060a] text-sm text-gray-300 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40">
                          <option value="GLOBAL">GLOBAL</option>
                          <option value="US">US</option>
                          <option value="Europe">Europa</option>
                          <option value="Latam">Latam</option>
                        </select>
                        <select value={fty} onChange={e => setFty(e.target.value)}
                          className="bg-[#04060a] text-sm text-gray-300 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40">
                          <option value="Software">Software</option>
                          <option value="Game">Juego</option>
                          <option value="DLC">DLC</option>
                          <option value="Gift Card">Gift Card</option>
                          <option value="Operating System">Sistema Operativo</option>
                          <option value="Security">Seguridad</option>
                          <option value="Server">Servidor</option>
                        </select>
                        <input type="text" value={fg} onChange={e => setFg(e.target.value)} placeholder="Género / Categoría"
                          className="bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 placeholder:text-gray-700" />
                        <div className="flex items-center gap-5 flex-wrap">
                          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                            <input type="checkbox" checked={ffeat} onChange={e => setFfeat(e.target.checked)}
                              className="rounded border-white/10 text-[#007cff] focus:ring-[#007cff]/30 bg-[#04060a]" />
                            Destacado
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                            <input type="checkbox" checked={fhot} onChange={e => setFhot(e.target.checked)}
                              className="rounded border-white/10 text-[#007cff] focus:ring-[#007cff]/30 bg-[#04060a]" />
                            Hot Deal
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                            <input type="checkbox" checked={frecent} onChange={e => setFrecent(e.target.checked)}
                              className="rounded border-white/10 text-[#007cff] focus:ring-[#007cff]/30 bg-[#04060a]" />
                            Reciente
                          </label>
                          <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                            <input type="checkbox" checked={fpopular} onChange={e => setFpopular(e.target.checked)}
                              className="rounded border-white/10 text-[#007cff] focus:ring-[#007cff]/30 bg-[#04060a]" />
                            Popular
                          </label>
                        </div>
                      </div>
                      {!editP && (
                        <div className="space-y-1.5">
                          <label className="text-xs text-gray-500 font-medium">Claves iniciales (una por línea)</label>
                          <textarea rows={3} value={fkeys} onChange={e => setFkeys(e.target.value)}
                            placeholder="XXXXX-XXXXX-XXXXX-XXXXX&#10;YYYYY-YYYYY-YYYYY-YYYYY"
                            className="w-full bg-[#04060a] text-sm font-mono text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 placeholder:text-gray-700" />
                        </div>
                      )}
                      <button type="submit" disabled={submitting}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#007cff] to-blue-600 hover:from-[#007cff] hover:to-blue-500 text-white text-sm font-semibold rounded-lg transition-all cursor-pointer shadow-lg shadow-[#007cff]/10">
                        {submitting ? 'Guardando...' : editP ? 'Actualizar Producto' : 'Crear Producto'}
                      </button>
                    </form>
                  </div>
                )}

                {/* Inventory Header with View Toggle */}
                <div className="bg-[#0a0e1a] rounded-xl border border-white/[0.04] overflow-hidden hover:border-white/[0.06] transition-all duration-300">
                  <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-semibold text-gray-200">Inventario ({products.length})</h3>
                      <span className="text-xs text-gray-600 bg-[#04060a] px-2.5 py-1 rounded-lg border border-white/[0.04]">
                        {products.filter(p => (p.keys?.length ?? 0) > 0).length} con stock
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#04060a] border border-white/[0.04] rounded-lg p-0.5">
                      <button onClick={() => setViewMode('table')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                          viewMode === 'table' ? 'bg-[#007cff]/10 text-[#007cff] border border-[#007cff]/20' : 'text-gray-500 hover:text-gray-300 border border-transparent'
                        }`}>
                        <ListFilter className="h-3.5 w-3.5" />
                        Tabla
                      </button>
                      <button onClick={() => setViewMode('grid')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                          viewMode === 'grid' ? 'bg-[#007cff]/10 text-[#007cff] border border-[#007cff]/20' : 'text-gray-500 hover:text-gray-300 border border-transparent'
                        }`}>
                        <Package className="h-3.5 w-3.5" />
                        Grid
                      </button>
                    </div>
                  </div>

                  {/* Table View */}
                  {viewMode === 'table' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs text-gray-600 border-b border-white/[0.04]">
                          <th className="text-left font-semibold py-3.5 px-5">Producto</th>
                          <th className="text-left font-semibold py-3.5 px-5">Plataforma</th>
                          <th className="text-center font-semibold py-3.5 px-5">Región</th>
                          <th className="text-right font-semibold py-3.5 px-5">Precio</th>
                          <th className="text-center font-semibold py-3.5 px-5">Stock</th>
                          <th className="text-center font-semibold py-3.5 px-5">Vend.</th>
                          <th className="text-center font-semibold py-3.5 px-5">Estado</th>
                          <th className="text-center font-semibold py-3.5 px-5"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {products.map(p => {
                          const stock = p.keys?.length ?? 0;
                          const sold = p._count?.orderItems ?? 0;
                          return (
                            <tr key={p.id} className="text-sm transition-colors hover:bg-white/[0.02]">
                              <td className="py-3.5 px-5">
                                <div className="flex items-center gap-3">
                                  <div className="relative w-8 h-8 rounded-lg bg-[#04060a] border border-white/[0.06] overflow-hidden shrink-0">
                                    <SafeImage src={p.image} alt="" fill sizes="32px" className="object-cover" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-200 truncate max-w-[200px]">{p.title}</p>
                                    <p className="text-xs text-gray-600">{p.type}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-5">
                                <span className="text-xs text-gray-500 bg-[#04060a] px-2.5 py-1 rounded-lg border border-white/[0.04]">{p.platform}</span>
                              </td>
                              <td className="py-3.5 px-5 text-center text-xs text-cyan-500 font-medium">{p.region}</td>
                              <td className="py-3.5 px-5 text-right font-medium text-gray-200">
                                {money(p.price)}
                                {p.originalPrice && <span className="text-xs text-gray-600 line-through ml-1.5">{money(p.originalPrice)}</span>}
                              </td>
                              <td className="py-3.5 px-5 text-center font-medium">{stock}</td>
                              <td className="py-3.5 px-5 text-center text-gray-600">{sold}</td>
                              <td className="py-3.5 px-5 text-center">
                                {stock === 0 ? (
                                  <span className="text-xs font-medium text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full">Agotado</span>
                                ) : stock <= 2 ? (
                                  <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">Bajo</span>
                                ) : (
                                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">Disponible</span>
                                )}
                              </td>
                              <td className="py-3.5 px-5 text-center">
                                <div className="flex items-center justify-center gap-1 flex-wrap max-w-[220px] sm:max-w-none">
                                  <button onClick={() => handleToggle(p.id, 'isRecent')}
                                    disabled={toggling === p.id + 'isRecent'}
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full transition-all cursor-pointer border ${
                                      p.isRecent ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' : 'text-gray-600 bg-transparent border-transparent hover:text-cyan-400 hover:bg-cyan-500/10'
                                    }`}>
                                    Nuevo
                                  </button>
                                  <button onClick={() => handleToggle(p.id, 'isPopular')}
                                    disabled={toggling === p.id + 'isPopular'}
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full transition-all cursor-pointer border ${
                                      p.isPopular ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-gray-600 bg-transparent border-transparent hover:text-amber-400 hover:bg-amber-500/10'
                                    }`}>
                                    Popular
                                  </button>
                                  <button onClick={() => handleToggle(p.id, 'isFeatured')}
                                    disabled={toggling === p.id + 'isFeatured'}
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full transition-all cursor-pointer border ${
                                      p.isFeatured ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-gray-600 bg-transparent border-transparent hover:text-blue-400 hover:bg-blue-500/10'
                                    }`}>
                                    Destacado
                                  </button>
                                  <button onClick={() => handleToggle(p.id, 'isHot')}
                                    disabled={toggling === p.id + 'isHot'}
                                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full transition-all cursor-pointer border ${
                                      p.isHot ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' : 'text-gray-600 bg-transparent border-transparent hover:text-orange-400 hover:bg-orange-500/10'
                                    }`}>
                                    Hot
                                  </button>
                                </div>
                              </td>
                              <td className="py-3.5 px-5">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button onClick={() => { openEdit(p); setShowForm(true); }}
                                    className="p-1.5 text-gray-600 hover:text-amber-400 transition-colors cursor-pointer rounded-lg hover:bg-amber-500/10" title="Editar">
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                  <button onClick={() => { setConfirmId(p.id); setConfirmType('product'); }}
                                    className="p-1.5 text-gray-600 hover:text-red-400 transition-colors cursor-pointer rounded-lg hover:bg-red-500/10" title="Eliminar">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  )}
                </div>

                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map(p => {
                      const stock = p.keys?.length ?? 0;
                      const sold = p._count?.orderItems ?? 0;
                      return (
                        <div key={p.id} className="relative group">
                          <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.04] to-transparent rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative bg-[#0a0e1a] border border-white/[0.04] rounded-xl overflow-hidden hover:border-white/[0.08] transition-all duration-300 flex flex-col h-full">
                            {/* Image */}
                            <div className="relative h-36 bg-[#04060a] border-b border-white/[0.04] overflow-hidden">
                              <SafeImage src={p.image} alt={p.title} fill sizes="(max-width: 640px) 100vw, 300px" className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-transparent" />
                              {/* Toggle Badges */}
                              <div className="absolute top-2.5 left-2.5 flex gap-1.5 flex-wrap">
                                <button onClick={(e) => { e.stopPropagation(); handleToggle(p.id, 'isRecent'); }}
                                  disabled={toggling === p.id + 'isRecent'}
                                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md transition-all cursor-pointer border ${
                                    p.isRecent ? 'bg-cyan-500/90 text-white border-cyan-400/30' : 'bg-[#0a0e1a]/70 text-gray-500 border-white/[0.06] hover:text-cyan-400 hover:border-cyan-500/30'
                                  }`}>
                                  {toggling === p.id + 'isRecent' ? '...' : 'Nuevo'}
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleToggle(p.id, 'isPopular'); }}
                                  disabled={toggling === p.id + 'isPopular'}
                                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md transition-all cursor-pointer border ${
                                    p.isPopular ? 'bg-amber-500/90 text-white border-amber-400/30' : 'bg-[#0a0e1a]/70 text-gray-500 border-white/[0.06] hover:text-amber-400 hover:border-amber-500/30'
                                  }`}>
                                  {toggling === p.id + 'isPopular' ? '...' : 'Popular'}
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleToggle(p.id, 'isFeatured'); }}
                                  disabled={toggling === p.id + 'isFeatured'}
                                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md transition-all cursor-pointer border ${
                                    p.isFeatured ? 'bg-[#007cff]/90 text-white border-blue-400/30' : 'bg-[#0a0e1a]/70 text-gray-500 border-white/[0.06] hover:text-blue-400 hover:border-blue-500/30'
                                  }`}>
                                  {toggling === p.id + 'isFeatured' ? '...' : 'Destacado'}
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleToggle(p.id, 'isHot'); }}
                                  disabled={toggling === p.id + 'isHot'}
                                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md transition-all cursor-pointer border ${
                                    p.isHot ? 'bg-orange-500/90 text-white border-orange-400/30' : 'bg-[#0a0e1a]/70 text-gray-500 border-white/[0.06] hover:text-orange-400 hover:border-orange-500/30'
                                  }`}>
                                  {toggling === p.id + 'isHot' ? '...' : 'Hot'}
                                </button>
                              </div>
                              {/* Stock badge */}
                              <div className="absolute top-2.5 right-2.5">
                                {stock === 0 ? (
                                  <span className="text-[9px] font-bold text-red-400 bg-red-500/15 backdrop-blur-sm px-2 py-0.5 rounded-md border border-red-500/10">Agotado</span>
                                ) : stock <= 2 ? (
                                  <span className="text-[9px] font-bold text-amber-400 bg-amber-500/15 backdrop-blur-sm px-2 py-0.5 rounded-md border border-amber-500/10">Bajo ({stock})</span>
                                ) : (
                                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/15 backdrop-blur-sm px-2 py-0.5 rounded-md border border-emerald-500/10">Stock ({stock})</span>
                                )}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 flex flex-col flex-grow">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#007cff]">{p.platform}</span>
                                <span className="text-[10px] text-gray-600 bg-[#04060a] px-2 py-0.5 rounded border border-white/[0.04]">{p.region}</span>
                              </div>
                              <h4 className="text-sm font-medium text-gray-200 line-clamp-2 min-h-[40px] leading-snug mb-3">{p.title}</h4>

                              <div className="mt-auto pt-3 border-t border-white/[0.04]">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex flex-col">
                                    {p.originalPrice && <span className="text-[10px] text-gray-600 line-through">{money(p.originalPrice)}</span>}
                                    <span className="text-base font-bold text-white">{money(p.price)}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[10px] text-gray-600">{sold} vendido{sold !== 1 ? 's' : ''}</span>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                  <button onClick={() => { openEdit(p); setShowForm(true); }}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-medium rounded-lg border border-amber-500/10 transition-all cursor-pointer">
                                    <Edit3 className="h-3.5 w-3.5" />
                                    Editar
                                  </button>
                                  <button onClick={() => { setSelProd(p.id); setShowAddKeys(true); }}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-medium rounded-lg border border-cyan-500/10 transition-all cursor-pointer">
                                    <Key className="h-3.5 w-3.5" />
                                    Keys
                                  </button>
                                  <button onClick={() => { setConfirmId(p.id); setConfirmType('product'); }}
                                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/10 transition-all cursor-pointer" title="Eliminar">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ─── DISEÑO DE SECCIONES ─── */}
            {tab === 'design' && (
              <>
                {/* Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {[
                    { label: 'HOT', count: products.filter(p => p.isHot).length, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/10', icon: Tag },
                    { label: 'Mas comprado', count: products.filter(p => p.isBestSeller).length, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/10', icon: Trophy },
                  ].map(s => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className={`bg-[#0a0e1a] rounded-xl p-5 border ${s.border} flex items-center gap-4`}>
                        <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}><Icon className="h-5 w-5" /></div>
                        <div>
                          <span className="text-2xl font-bold text-white">{s.count}</span>
                          <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Layout config */}
                <div className="bg-[#0c0e14] border border-white/[0.04] rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#9eb8d9]/10 text-[#9eb8d9]"><LayoutDashboard className="h-4 w-4" /></div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-[#9eb8d9]">// Layout</div>
                      <h3 className="text-sm font-display text-[#e8e6e1]">Diseño de la home y catálogo</h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* Home columns */}
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-[#6b7080] mb-2">
                          Columnas en shelves (home)
                        </label>
                        <div className="flex items-center gap-2">
                          {[2, 3, 4, 5, 6].map(n => (
                            <button key={n} onClick={() => setHomeColumns(n)}
                              className={`flex-1 font-mono text-sm py-2 rounded-md border transition-colors ${
                                homeColumns === n
                                  ? 'bg-[#9eb8d9]/10 border-[#9eb8d9]/40 text-[#9eb8d9]'
                                  : 'bg-[#06080c] border-white/[0.06] text-[#6b7080] hover:text-[#e8e6e1] hover:border-white/[0.10]'
                              }`}>
                              {n}
                            </button>
                          ))}
                        </div>
                        <p className="font-mono text-[10px] text-[#6b7080] mt-1.5">Recently Added, Hot, etc.</p>
                      </div>

                      {/* Home featured count */}
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-[#6b7080] mb-2">
                          Cantidad por shelf
                        </label>
                        <div className="flex items-center gap-2">
                          {[4, 6, 8, 12, 16, 20].map(n => (
                            <button key={n} onClick={() => setHomeFeaturedCount(n)}
                              className={`flex-1 font-mono text-sm py-2 rounded-md border transition-colors ${
                                homeFeaturedCount === n
                                  ? 'bg-[#9eb8d9]/10 border-[#9eb8d9]/40 text-[#9eb8d9]'
                                  : 'bg-[#06080c] border-white/[0.06] text-[#6b7080] hover:text-[#e8e6e1] hover:border-white/[0.10]'
                              }`}>
                              {n}
                            </button>
                          ))}
                        </div>
                        <p className="font-mono text-[10px] text-[#6b7080] mt-1.5">Productos por cada shelf</p>
                      </div>

                      {/* Catalog columns */}
                      <div>
                        <label className="block font-mono text-[10px] uppercase tracking-wider text-[#6b7080] mb-2">
                          Columnas en catálogo
                        </label>
                        <div className="flex items-center gap-2">
                          {[2, 3, 4, 5, 6].map(n => (
                            <button key={n} onClick={() => setCatalogColumns(n)}
                              className={`flex-1 font-mono text-sm py-2 rounded-md border transition-colors ${
                                catalogColumns === n
                                  ? 'bg-[#9eb8d9]/10 border-[#9eb8d9]/40 text-[#9eb8d9]'
                                  : 'bg-[#06080c] border-white/[0.06] text-[#6b7080] hover:text-[#e8e6e1] hover:border-white/[0.10]'
                              }`}>
                              {n}
                            </button>
                          ))}
                        </div>
                        <p className="font-mono text-[10px] text-[#6b7080] mt-1.5">Vista con búsqueda/filtros</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                      <p className="font-mono text-[10px] text-[#6b7080]">
                        Los cambios se aplican al guardar y refrescar la home
                      </p>
                      <button onClick={handleSaveDesign} disabled={savingDesign}
                        className="flex items-center gap-2 px-5 py-2 bg-[#9eb8d9] hover:bg-[#b5c7e0] disabled:bg-[#6b7080] text-[#08090c] text-sm font-mono font-semibold rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed">
                        {savingDesign ? 'Saving...' : 'Guardar diseño'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick add */}
                <div className="bg-[#0a0e1a] rounded-xl border border-white/[0.04] overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#007cff]/10 text-[#007cff]"><Plus className="h-4 w-4" /></div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-200">Agregar a Sección</h3>
                      <p className="text-[11px] text-gray-600">Selecciona un producto y agrégalo a la sección deseada</p>
                    </div>
                  </div>
                  <div className="p-5 flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <label className="text-xs text-gray-500 font-medium mb-1.5 block">Producto</label>
                      <select value={selProd} onChange={e => setSelProd(e.target.value)}
                        className="w-full bg-[#04060a] text-sm text-gray-300 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40">
                        <option value="" disabled>Seleccionar producto</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                      </select>
                    </div>
                    {[
                      { field: 'isHot' as const, label: 'HOT', color: 'orange', Icon: Tag },
                      { field: 'isBestSeller' as const, label: 'Mas comprado', color: 'emerald', Icon: Trophy },
                    ].map(btn => {
                      const Icon = btn.Icon;
                      const cc: Record<string, string> = {
                        orange: 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/20',
                        emerald: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
                      };
                      return (
                        <button key={btn.field} onClick={() => { if (selProd) handleToggle(selProd, btn.field); }}
                          disabled={!selProd || toggling === selProd + btn.field}
                          className={`px-4 py-2.5 text-sm font-medium rounded-lg border transition-all cursor-pointer flex items-center gap-2 ${cc[btn.color]}`}>
                          <Icon className="h-4 w-4" />
                          {toggling === selProd + btn.field ? '...' : btn.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Product lists by section */}
                {[
                  { field: 'isHot' as const, label: 'HOT', color: 'orange', Icon: Tag },
                  { field: 'isBestSeller' as const, label: 'Mas comprado', color: 'emerald', Icon: Trophy },
                ].map(section => {
                  const filtered = products.filter(p => p[section.field]);
                  const colors: Record<string, string> = { orange: 'text-orange-400', emerald: 'text-emerald-400' };
                  const bgColors: Record<string, string> = { orange: 'bg-orange-500/10', emerald: 'bg-emerald-500/10' };
                  const borderColors: Record<string, string> = { orange: 'border-orange-500/10', emerald: 'border-emerald-500/10' };
                  return (
                    <div key={section.field} className="bg-[#0a0e1a] rounded-xl border border-white/[0.04] overflow-hidden">
                      <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${bgColors[section.color]} ${colors[section.color]}`}>
                          <section.Icon className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-200">{section.label}</h3>
                        <span className="text-xs text-gray-600 bg-[#04060a] px-2.5 py-1 rounded-lg border border-white/[0.04]">{filtered.length}</span>
                      </div>
                      <div className="p-5">
                        {filtered.length === 0 ? (
                          <p className="text-sm text-gray-600 text-center py-4">No hay productos en esta sección.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {filtered.map(p => (
                              <div key={p.id} className="flex items-center gap-3 p-3 bg-[#04060a] border border-white/[0.04] rounded-xl hover:border-white/[0.08] transition-all group">
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/[0.06] shrink-0">
                                  <SafeImage src={p.image} alt="" fill sizes="40px" className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-200 truncate">{p.title}</p>
                                  <p className="text-xs text-gray-600">{p.platform} · {money(p.price)}</p>
                                </div>
                                <button onClick={() => handleToggle(p.id, section.field)}
                                  disabled={toggling === p.id + section.field}
                                  className={`shrink-0 px-3 py-1.5 ${bgColors[section.color]} hover:bg-red-500/10 ${colors[section.color]} hover:text-red-400 text-[11px] font-semibold rounded-lg border ${borderColors[section.color]} hover:border-red-500/20 transition-all cursor-pointer`}>
                                  {toggling === p.id + section.field ? '...' : 'Quitar'}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* ─── PLATFORMS ─── */}
            {tab === 'platforms' && (
              <>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setShowPlatformForm(!showPlatformForm); setEditPlatform(null); setPfName(''); setPfIcon('Monitor'); setPfColor('text-blue-400'); setPfBg('bg-blue-500/10'); }}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-all cursor-pointer ${showPlatformForm ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-[#007cff]/10 border-[#007cff]/20 text-[#007cff] hover:bg-[#007cff]/15'}`}>
                    {showPlatformForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {showPlatformForm ? 'Cerrar' : 'Nueva Plataforma'}
                  </button>
                </div>

                {showPlatformForm && (
                  <div className="relative">
                    <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.04] to-transparent rounded-xl pointer-events-none" />
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      setSubmitting(true);
                      const res = await fetch('/api/platforms', { method: editPlatform ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editPlatform?.id, name: pfName, icon: pfIcon, color: pfColor, bgColor: pfBg }) }).then(r => r.json());
                      if (res.success) { setFeedback({ success: true, message: editPlatform ? 'Plataforma actualizada.' : 'Plataforma creada.' }); setShowPlatformForm(false); setPfName(''); const data = await fetch('/api/platforms').then(r => r.json()); if (data.success) setPlatforms(data.platforms); router.push('/admin', { scroll: false }); }
                      else setFeedback({ success: false, message: res.error });
                      setSubmitting(false);
                    }} className="relative bg-[#0a0e1a] rounded-xl p-6 border border-white/[0.04] space-y-4">
                      <h3 className="text-sm font-semibold text-gray-200">{editPlatform ? `Editando: ${editPlatform.name}` : 'Nueva Plataforma'}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" required value={pfName} onChange={e => setPfName(e.target.value)} placeholder="Nombre (ej: Windows, Office)" className="bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 placeholder:text-gray-700" />
                        <select value={pfIcon} onChange={e => setPfIcon(e.target.value)} className="bg-[#04060a] text-sm text-gray-300 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40">
                          {[['Monitor','Monitor'],['HardDrive','HardDrive'],['ShieldCheck','Security'],['Server','Server'],['Gamepad2','Steam'],['Key','Other'],['Globe','Globe'],['Cpu','Cpu'],['Database','Database'],['Code','Code']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                        <select value={pfColor} onChange={e => setPfColor(e.target.value)} className="bg-[#04060a] text-sm text-gray-300 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40">
                          {[['text-gray-300','Light Gray'],['text-gray-400','Gray'],['text-gray-500','Dark Gray'],['text-white','White']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                        <select value={pfBg} onChange={e => setPfBg(e.target.value)} className="bg-[#04060a] text-sm text-gray-300 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40">
                          {[['bg-white/[0.03]','Subtle'],['bg-white/[0.05]','Soft'],['bg-white/[0.08]','Medium'],['bg-[#0f1014]','Solid']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                      </div>
                      <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-gradient-to-r from-[#007cff] to-blue-600 hover:from-[#007cff] hover:to-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all cursor-pointer shadow-lg shadow-[#007cff]/10">
                        {submitting ? 'Guardando...' : editPlatform ? 'Actualizar' : 'Crear Plataforma'}
                      </button>
                    </form>
                  </div>
                )}

                <div className="bg-[#0a0e1a] rounded-xl border border-white/[0.04] overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.04]"><h3 className="text-sm font-semibold text-gray-200">Plataformas ({platforms.length})</h3></div>
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {platforms.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-[#04060a] border border-white/[0.04] rounded-xl hover:border-white/[0.08] transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${p.bgColor} ${p.color}`}>{React.createElement(require('lucide-react')[p.icon] || Monitor, { className: 'h-4 w-4' })}</div>
                          <span className="text-sm font-medium text-gray-200">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setEditPlatform(p); setPfName(p.name); setPfIcon(p.icon); setPfColor(p.color); setPfBg(p.bgColor); setShowPlatformForm(true); }} className="p-1.5 text-gray-600 hover:text-amber-400 transition-colors cursor-pointer rounded-lg hover:bg-amber-500/10"><Edit3 className="h-3.5 w-3.5" /></button>
                          <button onClick={async () => { if (!confirm('Eliminar esta plataforma?')) return; const res = await fetch(`/api/platforms?id=${p.id}`, { method: 'DELETE' }).then(r => r.json()); if (res.success) { const data = await fetch('/api/platforms').then(r => r.json()); if (data.success) setPlatforms(data.platforms); setFeedback({ success: true, message: 'Plataforma eliminada.' }); } else setFeedback({ success: false, message: res.error }); }} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors cursor-pointer rounded-lg hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ─── BADGES ─── */}
            {tab === 'badges' && (
              <>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setShowBadgeForm(!showBadgeForm); setEditBadge(null); setBfName(''); setBfIcon('Star'); setBfColor('text-amber-400'); setBfBg('bg-amber-500/10'); setBfBorder('border-amber-500/20'); }}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-all cursor-pointer ${showBadgeForm ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-[#007cff]/10 border-[#007cff]/20 text-[#007cff] hover:bg-[#007cff]/15'}`}>
                    {showBadgeForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {showBadgeForm ? 'Cerrar' : 'Nuevo Badge'}
                  </button>
                </div>

                {showBadgeForm && (
                  <div className="relative">
                    <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.04] to-transparent rounded-xl pointer-events-none" />
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      setSubmitting(true);
                      const res = await fetch('/api/badges', { method: editBadge ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editBadge?.id, name: bfName, icon: bfIcon, color: bfColor, bgColor: bfBg, borderColor: bfBorder }) }).then(r => r.json());
                      if (res.success) { setFeedback({ success: true, message: editBadge ? 'Badge actualizado.' : 'Badge creado.' }); setShowBadgeForm(false); setBfName(''); const data = await fetch('/api/badges').then(r => r.json()); if (data.success) setBadges(data.badges); router.push('/admin', { scroll: false }); }
                      else setFeedback({ success: false, message: res.error });
                      setSubmitting(false);
                    }} className="relative bg-[#0a0e1a] rounded-xl p-6 border border-white/[0.04] space-y-4">
                      <h3 className="text-sm font-semibold text-gray-200">{editBadge ? `Editando: ${editBadge.name}` : 'Nuevo Badge'}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" required value={bfName} onChange={e => setBfName(e.target.value)} placeholder="Nombre (ej: Best Value, Official)" className="bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 placeholder:text-gray-700" />
                        <select value={bfIcon} onChange={e => setBfIcon(e.target.value)} className="bg-[#04060a] text-sm text-gray-300 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40">
                          {[['Star','Star'],['Trophy','Trophy'],['ShieldCheck','ShieldCheck'],['Zap','Zap'],['Clock','Clock'],['Award','Award'],['CheckCircle2','CheckCircle2'],['Tag','Tag']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                        <select value={bfColor} onChange={e => setBfColor(e.target.value)} className="bg-[#04060a] text-sm text-gray-300 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40">
                          {[['text-gray-300','Light Gray'],['text-gray-400','Gray'],['text-gray-500','Dark Gray'],['text-white','White']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                        <select value={bfBg} onChange={e => setBfBg(e.target.value)} className="bg-[#04060a] text-sm text-gray-300 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40">
                          {[['bg-white/[0.03]','Subtle'],['bg-white/[0.05]','Soft'],['bg-white/[0.08]','Medium'],['bg-[#0f1014]','Solid']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                        <select value={bfBorder} onChange={e => setBfBorder(e.target.value)} className="bg-[#04060a] text-sm text-gray-300 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40">
                          {[['border-white/[0.06]','Subtle'],['border-white/[0.08]','Soft'],['border-white/[0.12]','Medium'],['border-white/[0.16]','Strong']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                      </div>
                      <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-gradient-to-r from-[#007cff] to-blue-600 hover:from-[#007cff] hover:to-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all cursor-pointer shadow-lg shadow-[#007cff]/10">
                        {submitting ? 'Guardando...' : editBadge ? 'Actualizar' : 'Crear Badge'}
                      </button>
                    </form>
                  </div>
                )}

                <div className="bg-[#0a0e1a] rounded-xl border border-white/[0.04] overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.04]"><h3 className="text-sm font-semibold text-gray-200">Badges ({badges.length})</h3></div>
                  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {badges.map(b => (
                      <div key={b.id} className="flex items-center justify-between p-3 bg-[#04060a] border border-white/[0.04] rounded-xl hover:border-white/[0.08] transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${b.bgColor} ${b.color} border ${b.borderColor}`}>{React.createElement(require('lucide-react')[b.icon] || Star, { className: 'h-4 w-4' })}</div>
                          <span className="text-sm font-medium text-gray-200">{b.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setEditBadge(b); setBfName(b.name); setBfIcon(b.icon); setBfColor(b.color); setBfBg(b.bgColor); setBfBorder(b.borderColor); setShowBadgeForm(true); }} className="p-1.5 text-gray-600 hover:text-amber-400 transition-colors cursor-pointer rounded-lg hover:bg-amber-500/10"><Edit3 className="h-3.5 w-3.5" /></button>
                          <button onClick={async () => { if (!confirm('Eliminar este badge?')) return; const res = await fetch(`/api/badges?id=${b.id}`, { method: 'DELETE' }).then(r => r.json()); if (res.success) { const data = await fetch('/api/badges').then(r => r.json()); if (data.success) setBadges(data.badges); setFeedback({ success: true, message: 'Badge eliminado.' }); } else setFeedback({ success: false, message: res.error }); }} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors cursor-pointer rounded-lg hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ─── REWARDS ─── */}
            {tab === 'rewards' && (
              <>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { setShowCouponForm(!showCouponForm); setEditCoupon(null); setCfCode(''); setCfType('percent'); setCfValue(''); setCfPoints(''); setCfExpires(''); }}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-all cursor-pointer ${showCouponForm ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-[#007cff]/10 border-[#007cff]/20 text-[#007cff] hover:bg-[#007cff]/15'}`}>
                    {showCouponForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {showCouponForm ? 'Cerrar' : 'Nuevo Cupón'}
                  </button>
                </div>

                {showCouponForm && (
                  <div className="relative">
                    <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.04] to-transparent rounded-xl pointer-events-none" />
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      setSubmitting(true);
                      const res = await fetch('/api/coupons', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code: cfCode, discountType: cfType, discountValue: Number(cfValue), minPoints: Number(cfPoints), expiresAt: cfExpires || undefined }),
                      }).then(r => r.json());
                      if (res.success) {
                        setFeedback({ success: true, message: 'Cupón creado.' });
                        setShowCouponForm(false); setCfCode('');
                        const data = await fetch('/api/coupons').then(r => r.json());
                        if (data.success) setCoupons(data.coupons || []);
                        router.push('/admin', { scroll: false });
                      } else setFeedback({ success: false, message: res.error });
                      setSubmitting(false);
                    }} className="relative bg-[#0a0e1a] rounded-xl p-6 border border-white/[0.04] space-y-4">
                      <h3 className="text-sm font-semibold text-gray-200">Nuevo Cupón</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" required value={cfCode} onChange={e => setCfCode(e.target.value.toUpperCase())} placeholder="Código (ej: SAVE5)"
                          className="bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 placeholder:text-gray-700 font-mono" />
                        <select value={cfType} onChange={e => setCfType(e.target.value)}
                          className="bg-[#04060a] text-sm text-gray-300 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40">
                          <option value="percent">Porcentaje (%)</option>
                          <option value="fixed">Monto fijo ($)</option>
                        </select>
                        <input type="number" step="0.01" required value={cfValue} onChange={e => setCfValue(e.target.value)} placeholder={cfType === 'percent' ? 'Descuento %' : 'Descuento $'}
                          className="bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 placeholder:text-gray-700" />
                        <input type="number" required value={cfPoints} onChange={e => setCfPoints(e.target.value)} placeholder="Puntos necesarios"
                          className="bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 placeholder:text-gray-700" />
                        <input type="date" value={cfExpires} onChange={e => setCfExpires(e.target.value)}
                          className="bg-[#04060a] text-sm text-gray-300 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40" />
                      </div>
                      <button type="submit" disabled={submitting}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#007cff] to-blue-600 hover:from-[#007cff] hover:to-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all cursor-pointer shadow-lg shadow-[#007cff]/10">
                        {submitting ? 'Guardando...' : 'Crear Cupón'}
                      </button>
                    </form>
                  </div>
                )}

                <div className="bg-[#0a0e1a] rounded-xl border border-white/[0.04] overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.04]">
                    <h3 className="text-sm font-semibold text-gray-200">Cupones ({coupons.length})</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs text-gray-600 border-b border-white/[0.04]">
                          <th className="text-left font-semibold py-3.5 px-5">Código</th>
                          <th className="text-left font-semibold py-3.5 px-5">Tipo</th>
                          <th className="text-right font-semibold py-3.5 px-5">Valor</th>
                          <th className="text-right font-semibold py-3.5 px-5">Puntos</th>
                          <th className="text-center font-semibold py-3.5 px-5">Estado</th>
                          <th className="text-center font-semibold py-3.5 px-5"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {coupons.map(c => (
                          <tr key={c.id} className="text-sm transition-colors hover:bg-white/[0.02]">
                            <td className="py-3.5 px-5">
                              <code className="text-sm font-mono text-cyan-400 bg-[#04060a] px-2.5 py-1 rounded-lg border border-white/[0.06]">{c.code}</code>
                            </td>
                            <td className="py-3.5 px-5 text-gray-400 capitalize">{c.discountType === 'percent' ? 'Porcentaje' : 'Fijo'}</td>
                            <td className="py-3.5 px-5 text-right font-medium text-gray-200">
                              {c.discountType === 'percent' ? `${c.discountValue}%` : `$${c.discountValue.toFixed(2)}`}
                            </td>
                            <td className="py-3.5 px-5 text-right font-medium text-amber-400">{c.minPoints} pts</td>
                            <td className="py-3.5 px-5 text-center">
                              {c.isRedeemed ? (
                                <span className="text-xs font-medium text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full">Canjeado</span>
                              ) : (
                                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">Activo</span>
                              )}
                            </td>
                            <td className="py-3.5 px-5 text-center">
                              <button onClick={async () => {
                                if (!confirm('Eliminar este cupón?')) return;
                                const res = await fetch(`/api/coupons?id=${c.id}`, { method: 'DELETE' }).then(r => r.json());
                                if (res.success) { const data = await fetch('/api/coupons').then(r => r.json()); if (data.success) setCoupons(data.coupons || []); setFeedback({ success: true, message: 'Cupón eliminado.' }); }
                                else setFeedback({ success: false, message: res.error });
                              }} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors cursor-pointer rounded-lg hover:bg-red-500/10" title="Eliminar">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {coupons.length === 0 && (
                          <tr><td colSpan={6} className="py-8 text-center text-sm text-gray-600">No hay cupones creados.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Default Points Config */}
                <div className="bg-[#0a0e1a] rounded-xl border border-white/[0.04] overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400"><Trophy className="h-4 w-4" /></div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-200">Configuración de Puntos</h3>
                      <p className="text-[11px] text-gray-600">Puntos ganados por cada dólar gastado</p>
                    </div>
                  </div>
                  <div className="p-5 flex items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm text-gray-400">Puntos por dólar:</span>
                      <input type="number" min={1} max={100} value={pointsPerDollar} onChange={e => setPointsPerDollar(Number(e.target.value))}
                        className="w-24 bg-[#04060a] text-center text-amber-400 font-bold text-lg px-3 py-2 rounded-lg border border-white/[0.06] focus:outline-none focus:border-amber-500/40" />
                      <span className="text-sm text-gray-500">pts</span>
                    </div>
                    <button onClick={async () => {
                      setSubmitting(true);
                      const res = await fetch('/api/config', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ pointsPerDollar }),
                      }).then(r => r.json());
                      if (res.success) setFeedback({ success: true, message: 'Configuración guardada.' });
                      else setFeedback({ success: false, message: res.error });
                      setSubmitting(false);
                    }} disabled={submitting}
                      className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {submitting ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ─── KEYS ─── */}
            {tab === 'keys' && (
              <>
                <div className="bg-[#0a0e1a] rounded-xl border border-white/[0.04] p-4 sm:p-5 grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-3">
                  <div className="flex items-center gap-3 sm:flex-1 min-w-0 sm:min-w-[220px]">
                    <Search className="h-4 w-4 text-gray-600 shrink-0" />
                    <input type="text" value={keySearch} onChange={e => setKeySearch(e.target.value)} placeholder="Buscar clave o producto..."
                      className="w-full bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40 placeholder:text-gray-700" />
                  </div>
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-3">
                    <select value={keyProdFilter} onChange={e => setKeyProdFilter(e.target.value)}
                      className="w-full bg-[#04060a] text-sm text-gray-300 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40">
                      <option value="all">Todos los productos</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                    <select value={keyStatus} onChange={e => setKeyStatus(e.target.value as any)}
                      className="w-full bg-[#04060a] text-sm text-gray-300 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-[#007cff]/40">
                      <option value="all">Todas</option>
                      <option value="available">Disponibles</option>
                      <option value="sold">Vendidas</option>
                    </select>
                  </div>
                  <span className="text-xs text-gray-600 bg-[#04060a] px-3 py-1.5 rounded-lg border border-white/[0.04] w-fit">
                    {filteredKeys.length} resultado{filteredKeys.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="bg-[#0a0e1a] rounded-xl border border-white/[0.04] overflow-hidden">
                  <div className="overflow-x-auto max-h-[650px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-[#0a0e1a] z-10">
                        <tr className="text-xs text-gray-600 border-b border-white/[0.04]">
                          <th className="text-left font-semibold py-3.5 px-5">#</th>
                          <th className="text-left font-semibold py-3.5 px-5">Clave</th>
                          <th className="text-left font-semibold py-3.5 px-5">Producto</th>
                          <th className="text-center font-semibold py-3.5 px-5">Estado</th>
                          <th className="text-right font-semibold py-3.5 px-5">Creada</th>
                          <th className="text-center font-semibold py-3.5 px-5"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {filteredKeys.map((k: any, i: number) => (
                          <tr key={k.id} className="text-sm transition-colors hover:bg-white/[0.02]">
                            <td className="py-3 px-5 text-gray-600 font-mono text-xs">{i + 1}</td>
                            <td className="py-3 px-5">
                              <div className="flex items-center gap-2">
                                <code className="text-sm font-mono text-gray-200 bg-[#04060a] px-2.5 py-1 rounded-lg border border-white/[0.06]">{k.code}</code>
                                <button onClick={() => { navigator.clipboard.writeText(k.code); setFeedback({ success: true, message: 'Clave copiada al portapapeles.' }); }}
                                  className="text-gray-600 hover:text-gray-300 transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/[0.04]">
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-5">
                              <Link href={`/product/${k.product.slug}`} className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5">
                                {k.product.title}
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </td>
                            <td className="py-3 px-5 text-center">
                              {k.isSold ? (
                                <span className="text-xs font-medium text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full">Vendida</span>
                              ) : (
                                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">Disponible</span>
                              )}
                            </td>
                            <td className="py-3 px-5 text-right text-xs text-gray-600">{fmtDate(k.createdAt)}</td>
                            <td className="py-3 px-5 text-center">
                              <button onClick={() => { setConfirmId(k.id); setConfirmType('key'); }}
                                className="p-1.5 text-gray-600 hover:text-red-400 transition-colors cursor-pointer rounded-lg hover:bg-red-500/10" title="Eliminar clave">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredKeys.length === 0 && (
                          <tr><td colSpan={6} className="py-12 text-center text-sm text-gray-600">No se encontraron claves con los filtros actuales.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ─── ORDERS ─── */}
            {tab === 'orders' && (
              <div className="bg-[#0a0e1a] rounded-xl border border-white/[0.04] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-200">Historial de Pedidos ({orders.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-gray-600 border-b border-white/[0.04]">
                        <th className="text-left font-semibold py-3.5 px-5">Cliente</th>
                        <th className="text-left font-semibold py-3.5 px-5">Email</th>
                        <th className="text-center font-semibold py-3.5 px-5">Items</th>
                        <th className="text-right font-semibold py-3.5 px-5">Total</th>
                        <th className="text-center font-semibold py-3.5 px-5">Estado</th>
                        <th className="text-right font-semibold py-3.5 px-5">Fecha</th>
                        <th className="text-center font-semibold py-3.5 px-5"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {orders.map((o: any) => (
                        <React.Fragment key={o.id}>
                          <tr className="text-sm transition-colors hover:bg-white/[0.02] cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === o.id ? null : o.id)}>
                            <td className="py-3.5 px-5 text-gray-200 font-medium">{o.customerName}</td>
                            <td className="py-3.5 px-5 text-gray-500">{o.customerEmail}</td>
                            <td className="py-3.5 px-5 text-center font-medium">{o.items.length}</td>
                            <td className="py-3.5 px-5 text-right font-semibold text-emerald-400">{money(o.total)}</td>
                            <td className="py-3.5 px-5 text-center">
                              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">{o.status}</span>
                            </td>
                            <td className="py-3.5 px-5 text-right text-xs text-gray-600">{fmtDate(o.createdAt)}</td>
                            <td className="py-3.5 px-5 text-center">
                              {expandedOrder === o.id ? (
                                <ChevronUp className="h-4 w-4 text-gray-400 mx-auto" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-600 mx-auto" />
                              )}
                            </td>
                          </tr>
                          {expandedOrder === o.id && o.items.map((item: any) => (
                            <tr key={item.id} className="bg-[#04060a]/50">
                              <td colSpan={7} className="py-4 px-10">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <Link href={`/product/${item.product.slug}`} className="text-sm font-medium text-gray-200 hover:text-blue-400 transition-colors flex items-center gap-1.5">
                                      {item.product.title}
                                      <ExternalLink className="h-3 w-3" />
                                    </Link>
                                    <p className="text-xs text-gray-600 mt-1">
                                      Cantidad: {item.quantity} × {money(item.price)}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs text-gray-500 font-medium mb-1.5">Keys Entregadas:</p>
                                    <div className="flex flex-col gap-1 items-end">
                                      {item.keys.map((ki: any, idx: number) => (
                                        <code key={idx} className="text-xs font-mono text-cyan-400 bg-[#0a0e1a] px-2.5 py-1 rounded-lg border border-cyan-500/10">
                                          {ki.code}
                                        </code>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                      {orders.length === 0 && (
                        <tr><td colSpan={7} className="py-12 text-center text-sm text-gray-600">No se encontraron pedidos.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── CUSTOMERS ─── */}
            {tab === 'customers' && (
              <div className="bg-[#0a0e1a] rounded-xl border border-white/[0.04] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.04]">
                  <h3 className="text-sm font-semibold text-gray-200">Base de Clientes ({customers.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-gray-600 border-b border-white/[0.04]">
                        <th className="text-left font-semibold py-3.5 px-5">Email</th>
                        <th className="text-center font-semibold py-3.5 px-5">Pedidos</th>
                        <th className="text-right font-semibold py-3.5 px-5">Total Gastado</th>
                        <th className="text-right font-semibold py-3.5 px-5">Última Compra</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {customers.map(c => (
                        <tr key={c.email} className="text-sm transition-colors hover:bg-white/[0.02]">
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-2.5">
                              <div className="p-1.5 rounded-lg bg-[#04060a] border border-white/[0.04]">
                                <Mail className="h-4 w-4 text-gray-600" />
                              </div>
                              <span className="font-medium text-gray-200">{c.email}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-5 text-center">
                            <span className="text-sm font-medium text-gray-300 bg-[#04060a] px-3 py-1 rounded-lg border border-white/[0.04]">{c.orderCount}</span>
                          </td>
                          <td className="py-3.5 px-5 text-right font-semibold text-emerald-400">{money(c.totalSpent)}</td>
                          <td className="py-3.5 px-5 text-right text-xs text-gray-600">{fmtDate(c.lastOrder)}</td>
                        </tr>
                      ))}
                      {customers.length === 0 && (
                        <tr><td colSpan={4} className="py-12 text-center text-sm text-gray-600">No hay clientes registrados.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─── SETTINGS ─── */}
            {tab === 'settings' && (
              <div className="space-y-6">
                {/* SEO */}
                <div className="bg-[#0a0e1a] rounded-xl border border-white/[0.04] overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Globe className="h-4 w-4" /></div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-200">SEO & Meta</h3>
                      <p className="text-[11px] text-gray-600">Información para motores de búsqueda y redes sociales</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Nombre del Sitio</label>
                      <input type="text" value={siteName} onChange={e => setSiteName(e.target.value)}
                        className="w-full bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-emerald-500/40 placeholder:text-gray-700" placeholder="PixelCodes" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Descripción del Sitio</label>
                      <textarea value={siteDescription} onChange={e => setSiteDescription(e.target.value)} rows={3}
                        className="w-full bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-emerald-500/40 placeholder:text-gray-700 resize-none" placeholder="La tienda premium de..." />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Palabras Clave (separadas por coma)</label>
                      <input type="text" value={siteKeywords} onChange={e => setSiteKeywords(e.target.value)}
                        className="w-full bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-emerald-500/40 placeholder:text-gray-700" placeholder="licencias, software, juegos, steam, xbox" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">URL del Sitio</label>
                        <input type="text" value={siteUrl} onChange={e => setSiteUrl(e.target.value)}
                          className="w-full bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-emerald-500/40 placeholder:text-gray-700" placeholder="https://tusitio.com" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">URL Logo</label>
                        <input type="text" value={logoUrl} onChange={e => setLogoUrl(e.target.value)}
                          className="w-full bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-emerald-500/40 placeholder:text-gray-700" placeholder="https://..." />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Imagen OG (Open Graph)</label>
                      <input type="text" value={ogImageUrl} onChange={e => setOgImageUrl(e.target.value)}
                        className="w-full bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-emerald-500/40 placeholder:text-gray-700" placeholder="https://... (imagen para compartir en redes)" />
                    </div>
                  </div>
                </div>

                {/* Tienda */}
                <div className="bg-[#0a0e1a] rounded-xl border border-white/[0.04] overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400"><DollarSign className="h-4 w-4" /></div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-200">Tienda</h3>
                      <p className="text-[11px] text-gray-600">Configuración de moneda y contacto</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Código Moneda</label>
                        <input type="text" value={currencyCode} onChange={e => setCurrencyCode(e.target.value)}
                          className="w-full bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-blue-500/40 placeholder:text-gray-700" placeholder="USD" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Símbolo Moneda</label>
                        <input type="text" value={currencySymbol} onChange={e => setCurrencySymbol(e.target.value)}
                          className="w-full bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-blue-500/40 placeholder:text-gray-700" placeholder="$" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Email Soporte</label>
                        <input type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)}
                          className="w-full bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-blue-500/40 placeholder:text-gray-700" placeholder="soporte@tusitio.com" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Puntos y Cashback */}
                <div className="bg-[#0a0e1a] rounded-xl border border-white/[0.04] overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400"><Gift className="h-4 w-4" /></div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-200">Puntos y Cashback</h3>
                      <p className="text-[11px] text-gray-600">Sistema de recompensas para clientes</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Puntos por Dólar Gastado</label>
                      <input type="number" value={pointsPerDollar} onChange={e => setPointsPerDollar(parseInt(e.target.value) || 0)}
                        className="w-full bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-purple-500/40 placeholder:text-gray-700" />
                      <p className="text-[11px] text-gray-600 mt-1">Los clientes ganan esta cantidad de puntos por cada dólar gastado</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={cashbackEnabled} onChange={e => setCashbackEnabled(e.target.checked)}
                          className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                      <span className="text-sm font-medium text-gray-300">Habilitar Cashback</span>
                    </div>
                    {cashbackEnabled && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Porcentaje Cashback (%)</label>
                        <input type="number" step="0.1" value={cashbackPercent} onChange={e => setCashbackPercent(parseFloat(e.target.value) || 0)}
                          className="w-full bg-[#04060a] text-sm text-gray-200 px-3.5 py-2.5 rounded-lg border border-white/[0.06] focus:outline-none focus:border-purple-500/40 placeholder:text-gray-700" />
                        <p className="text-[11px] text-gray-600 mt-1">Los clientes recibirán este porcentaje de vuelta en créditos</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botón Guardar */}
                <div className="flex justify-end">
                  <button onClick={handleSaveSettings} disabled={savingSettings}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed">
                    <Save className="h-4 w-4" />
                    {savingSettings ? 'Guardando...' : 'Guardar Configuración'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative">
            <div className="absolute -inset-[1px] bg-gradient-to-b from-white/[0.06] to-transparent rounded-2xl pointer-events-none" />
            <div className="relative bg-[#0a0e1a] rounded-2xl p-6 border border-white/[0.04] shadow-2xl max-w-sm w-full mx-4 space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/10">
                  <ShieldAlert className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-200">Confirmar Eliminación</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Esta acción es irreversible.</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                {confirmType === 'product'
                  ? 'Se eliminará el producto y todas sus claves de activación asociadas.'
                  : 'Se eliminará esta clave de activación permanentemente.'}
              </p>
              <div className="flex gap-3 justify-end pt-1">
                <button onClick={() => { setConfirmId(null); setConfirmType(null); }}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium rounded-xl transition-all cursor-pointer border border-white/[0.04]">
                  Cancelar
                </button>
                <button onClick={handleDelete}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer shadow-lg shadow-red-500/20">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function SectionBlock({ title, subtitle, color, icon, products, field, toggling, money, onToggle }: {
  title: string; subtitle: string; color: string; icon: React.ReactNode; products: ProductItem[];
  field: 'isRecent' | 'isPopular' | 'isBestSeller' | 'isOnSale'; toggling: string | null;
  money: (n: number) => string; onToggle: (id: string, f: 'isRecent' | 'isPopular' | 'isFeatured' | 'isHot' | 'isBestSeller' | 'isOnSale') => void;
}) {
  const colorMap: Record<string, { text: string; bg: string; border: string; badge: string; badgeBg: string }> = {
    cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/10', badge: 'text-cyan-400', badgeBg: 'bg-cyan-500/10' },
    amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/10', badge: 'text-amber-400', badgeBg: 'bg-amber-500/10' },
    emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/10', badge: 'text-emerald-400', badgeBg: 'bg-emerald-500/10' },
    orange: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/10', badge: 'text-orange-400', badgeBg: 'bg-orange-500/10' },
  };
  const c = colorMap[color] || colorMap.cyan;
  const sectionProducts = products.filter(p => p[field]);

  return (
    <div className="bg-[#0a0e1a] rounded-xl border border-white/[0.04] overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2.5">
        <div className={`p-1.5 rounded-lg ${c.bg} ${c.text}`}>{icon}</div>
        <div>
          <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
          <p className="text-[11px] text-gray-600">{subtitle}</p>
        </div>
        <span className={`ml-auto text-xs font-bold ${c.badge} ${c.badgeBg} px-2.5 py-1 rounded-full`}>
          {sectionProducts.length} productos
        </span>
      </div>
      <div className="p-5">
        {sectionProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No hay productos en esta sección.</p>
            <p className="text-xs text-gray-600 mt-1">Usa "Agregar Rápido" abajo para añadir productos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sectionProducts.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-[#04060a] border border-white/[0.04] rounded-xl hover:border-white/[0.08] transition-all">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/[0.06] shrink-0">
                  <SafeImage src={p.image} alt="" fill sizes="40px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{p.title}</p>
                  <p className="text-xs text-gray-600">{p.platform} · {money(p.price)}</p>
                </div>
                <button onClick={() => onToggle(p.id, field)}
                  disabled={toggling === p.id + field}
                  className={`shrink-0 px-3 py-1.5 ${c.bg} hover:bg-red-500/10 ${c.text} hover:text-red-400 text-[11px] font-semibold rounded-lg border ${c.border} hover:border-red-500/20 transition-all cursor-pointer`}>
                  {toggling === p.id + field ? '...' : 'Quitar'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { db } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import FilterSelect from '@/components/FilterSelect';
import SoftwareBox3D from '@/components/SoftwareBox3D';
import SafeImage from '@/components/SafeImage';
import {
  ShieldCheck, Zap, Headphones, Globe, ArrowRight, X, Sparkles, CheckCircle2,
  Star, Hexagon, TrendingUp, Clock, Search, CreditCard, RefreshCw, MessageSquare,
  Mail, ChevronRight, Flame, Tag, Trophy, Gamepad2, Monitor, Smartphone, Server,
  Cpu, HardDrive, Wifi, Key, Gift, Users, Shield, Lock, Database, Code, Bug
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ search?: string; platform?: string; sort?: string; region?: string }>;
}

const PLATFORMS = [
  { name: "Windows", icon: Monitor, color: "text-blue-400", bg: "bg-blue-500/10" },
  { name: "Office", icon: HardDrive, color: "text-orange-400", bg: "bg-orange-500/10" },
  { name: "Security", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { name: "Server", icon: Server, color: "text-purple-400", bg: "bg-purple-500/10" },
  { name: "SQL Server", icon: Database, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { name: "Visual Studio", icon: Code, color: "text-violet-400", bg: "bg-violet-500/10" },
];

const BRANDS = [
  { name: "Microsoft", icon: Monitor, color: "text-blue-400" },
  { name: "Kaspersky", icon: ShieldCheck, color: "text-emerald-400" },
  { name: "Norton", icon: Lock, color: "text-amber-400" },
  { name: "Bitdefender", icon: Bug, color: "text-red-400" },
  { name: "ESET", icon: Cpu, color: "text-cyan-400" },
  { name: "Malwarebytes", icon: Shield, color: "text-indigo-400" },
];

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || '';
  const platform = params.platform || '';
  const sort = params.sort || '';
  const region = params.region || '';

  const where: any = {};
  if (search) where.OR = [{ title: { contains: search } }, { description: { contains: search } }, { genre: { contains: search } }];
  if (platform && platform !== 'All') where.platform = { contains: platform };
  if (region && region !== 'All') where.region = region;

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price-asc') orderBy = { price: 'asc' };
  else if (sort === 'price-desc') orderBy = { price: 'desc' };
  else if (sort === 'rating') orderBy = { rating: 'desc' };

  const products = await db.product.findMany({ where, orderBy, include: { badges: true, platformObj: true } });
  const isDefault = !search && !platform && !region;

  const config = await db.siteConfig.findUnique({ where: { id: 'default' } }) || { homeColumns: 4, homeFeaturedCount: 8, catalogColumns: 4 };

  const [allProducts, recentProducts, popularProducts, bestSellerProducts, onSaleProducts, hotProducts] = isDefault ? await Promise.all([
    db.product.findMany({ take: 20, orderBy: { createdAt: 'desc' }, include: { badges: true, platformObj: true } }),
    db.product.findMany({ where: { isRecent: true }, take: config.homeFeaturedCount, orderBy: { createdAt: 'desc' }, include: { badges: true, platformObj: true } }),
    db.product.findMany({ where: { isPopular: true }, take: config.homeFeaturedCount, orderBy: { rating: 'desc' }, include: { badges: true, platformObj: true } }),
    db.product.findMany({ where: { isBestSeller: true }, take: config.homeFeaturedCount, orderBy: { rating: 'desc' }, include: { badges: true, platformObj: true } }),
    db.product.findMany({ where: { isOnSale: true }, take: config.homeFeaturedCount, orderBy: { createdAt: 'desc' }, include: { badges: true, platformObj: true } }),
    db.product.findMany({ where: { isHot: true }, take: config.homeFeaturedCount, orderBy: { createdAt: 'desc' }, include: { badges: true, platformObj: true } }),
  ]) : [[], [], [], [], [], []];

  const heroProduct = await db.product.findFirst({ where: { slug: "microsoft-windows-11-pro-retail" } }) || products[0];

  return (
    <div className="flex-1 flex flex-col bg-[#04060a]">

      {/* ─── HERO ─── */}
      {isDefault && (
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#0b0c10] via-[#060608] to-[#04060a] py-16 sm:py-20 lg:py-24">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[150px]" />
            <div className="absolute bottom-[0%] right-[10%] w-[400px] h-[400px] bg-neutral-500/[0.02] rounded-full blur-[120px]" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-6">
            <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider text-gray-400">
              <Zap className="h-3.5 w-3.5" />
              <span>Instant Digital Delivery — Software Keys</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05]">
              Buy Software Keys{' '}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-gray-200 via-gray-400 to-gray-500 bg-clip-text text-transparent">Instantly</span>
              <br />
              <span className="text-gray-500 text-3xl sm:text-4xl lg:text-5xl">at the Best Prices</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-500 max-w-lg leading-relaxed">
              Windows, Office, Antivirus and more. Instant delivery. Secure checkout. Best deals online.
            </p>

            {/* Search Bar */}
            <div className="w-full max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
              <input type="text" placeholder="Search software, keys, licenses..."
                className="w-full bg-[#0f1014] text-sm text-gray-200 pl-12 pr-4 py-4 rounded-xl border border-white/[0.06] focus:outline-none focus:border-white/[0.12] focus:ring-1 focus:ring-white/[0.08] transition-all placeholder:text-gray-600 shadow-lg" />
            </div>

            {/* Platform Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {PLATFORMS.map(p => {
                const Icon = p.icon;
                return (
                  <Link key={p.name} href={`/?platform=${p.name}`}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0f1014] text-gray-400 border border-white/[0.05] hover:border-white/[0.10] hover:text-gray-300 transition-all`}>
                    <Icon className="h-3.5 w-3.5" />
                    {p.name}
                  </Link>
                );
              })}
              <Link href="/?search="
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.04] text-gray-300 border border-white/[0.08] hover:bg-white/[0.06] transition-all">
                All Software →
              </Link>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
              <Link href="#catalog"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white/[0.05] hover:bg-white/[0.08] text-white font-semibold text-sm rounded-xl transition-all border border-white/[0.08] hover:border-white/[0.12] cursor-pointer">
                Browse Store
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/?search=hot"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0f1014] hover:bg-[#0f1014]/80 text-gray-400 font-semibold text-sm rounded-xl border border-white/[0.05] hover:border-white/[0.10] transition-all cursor-pointer">
                <Flame className="h-4 w-4 text-gray-500" />
                Hot Deals
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-[11px] text-gray-600">
              {[
                { icon: Zap, label: 'Instant Digital Delivery' },
                { icon: ShieldCheck, label: 'Secure checkout' },
                { icon: CreditCard, label: 'Instant - Bank Transfer' },
                { icon: RefreshCw, label: 'Key replacement' },
              ].map(b => {
                const Icon = b.icon;
                return (
                  <span key={b.label} className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-gray-500" />
                    {b.label}
                  </span>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── TRUST BAR ─── */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-4 z-20 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#0f1014]/90 backdrop-blur-md border border-white/[0.04] p-4 sm:p-5 rounded-xl">
          {[
            { icon: ShieldCheck, label: 'Secure', desc: 'Secure Payments' },
            { icon: Zap, label: 'Instant', desc: 'Instant Digital Delivery' },
            { icon: CreditCard, label: 'Flexible', desc: 'Multiple Payment Methods' },
            { icon: Headphones, label: 'Protected', desc: 'Email & ticket support' },
          ].map(b => {
            const Icon = b.icon;
            return (
              <div key={b.label} className="flex items-center gap-3 px-2 py-1">
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-gray-500 shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-300">{b.label}</h4>
                  <p className="text-[11px] text-gray-600">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── SHELVES ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12">
        {isDefault ? (
          <div className="flex flex-col gap-12">

            {/* Recently Added */}
            {recentProducts.length > 0 && (
              <Shelf
                title="Recently Added"
                subtitle="New software just arrived"
                color="bg-gray-500"
                icon={<Clock className="h-4 w-4" />}
                link="/?sort=rating"
                products={recentProducts}
                cols={config.homeColumns}
              />
            )}

            {/* HOT Products - List Style */}
            {hotProducts.length > 0 && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1 h-5 rounded-full bg-gray-500" />
                    <div>
                      <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                        <Flame className="h-4 w-4 text-gray-500" />
                        Hot Products
                      </h2>
                      <p className="text-[11px] text-gray-600 mt-0.5">Limited time offers you shouldn't miss</p>
                    </div>
                  </div>
                  <Link href="/?search=hot" className="text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1">
                    View all <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  {hotProducts.map(p => (
                    <Link key={p.id} href={`/product/${p.slug}`}
                      className="group flex items-center gap-4 bg-[#0f1014] border border-white/[0.04] hover:border-white/[0.08] rounded-xl p-3 transition-all duration-300 hover:bg-[#0f1014]/80">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-white/[0.06] shrink-0 bg-[#060608]">
                        <SafeImage src={p.image} alt={p.title} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300 bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.06]">HOT</span>
                          <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider">{p.platform}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-200 group-hover:text-white truncate transition-colors">{p.title}</h3>
                        <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">{p.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {p.originalPrice && (
                          <span className="text-xs text-gray-600 line-through block">{p.originalPrice.toFixed(2)}</span>
                        )}
                        <span className="text-base font-bold text-white">${p.price.toFixed(2)}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.03] text-gray-500 group-hover:bg-white/[0.06] group-hover:text-gray-300 transition-colors">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Browse by Platform */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-1 h-5 rounded-full bg-gray-500" />
                  <h2 className="text-sm font-semibold text-gray-200">Browse by Platform</h2>
                </div>
                <Link href="/" className="text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {PLATFORMS.map(p => {
                  const Icon = p.icon;
                  return (
                    <Link key={p.name} href={`/?platform=${p.name}`}
                      className="flex flex-col items-center justify-center py-6 rounded-xl bg-[#0f1014] border border-white/[0.04] hover:border-white/[0.08] hover:bg-[#0f1014]/80 transition-all duration-300 group">
                      <div className="p-3 rounded-xl bg-white/[0.03] text-gray-500 mb-2 group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{p.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Brands */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2.5 border-b border-white/[0.04] pb-3">
                <div className="w-1 h-5 rounded-full bg-gray-500" />
                <h2 className="text-sm font-semibold text-gray-200">Browse by Brand</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {BRANDS.map(b => {
                  const Icon = b.icon;
                  return (
                    <Link key={b.name} href={`/?search=${b.name}`}
                      className="flex flex-col items-center justify-center py-6 rounded-xl bg-[#0f1014] border border-white/[0.04] hover:border-white/[0.08] hover:bg-[#0f1014]/80 transition-all duration-300 group">
                      <div className="p-3 rounded-xl bg-white/[0.03] text-gray-500 mb-2 group-hover:scale-110 transition-transform">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{b.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Newsletter */}
            <div className="relative bg-[#0f1014] border border-white/[0.04] rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-transparent pointer-events-none" />
              <div className="relative p-8 sm:p-10 flex flex-col items-center text-center gap-5">
                <div className="inline-flex items-center gap-1.5 bg-white/[0.04] text-gray-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/[0.06]">
                  <Mail className="h-3 w-3" />
                  Game Deals Newsletter
                </div>
                <div className="flex flex-col gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Never Miss a <span className="text-gray-400">Game Deal</span>
                </h2>
                  <p className="text-sm text-gray-500 max-w-md">
                    Join 50,000+ gamers receiving exclusive flash sales and new releases straight to their inbox.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-gray-600">
                  {['Flash Sales', 'Weekly Deals', 'New Releases', 'Price Drops'].map(t => (
                    <span key={t} className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-gray-500" />
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex w-full max-w-md gap-2">
                  <input type="email" placeholder="Enter your email"
                    className="flex-1 bg-[#060608] text-sm text-gray-200 px-4 py-3 rounded-lg border border-white/[0.06] focus:outline-none focus:border-white/[0.12] placeholder:text-gray-700" />
                  <button className="px-6 py-3 bg-white/[0.07] hover:bg-white/[0.10] text-white text-sm font-semibold rounded-lg transition-all border border-white/[0.08] cursor-pointer flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Subscribe
                  </button>
                </div>
                <p className="text-[10px] text-gray-600">No spam. Unsubscribe anytime.</p>
              </div>
            </div>

          </div>
        ) : (
          /* ─── FILTER VIEW ─── */
          <div className="flex flex-col gap-6 pb-16">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-6 rounded-full bg-[#007cff]" />
                <h2 className="text-sm font-semibold text-gray-200">
                  {search ? `Results: "${search}"` : platform ? `Licencias ${platform}` : 'Catalog'}
                </h2>
              </div>
              {products.length > 0 && (
                <span className="text-xs font-medium text-gray-600 bg-[#0a0e1a] px-3 py-1.5 rounded-lg border border-white/[0.04]">
                  {products.length} product{products.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="bg-[#0a0e1a] border border-white/[0.04] p-5 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <FilterSelect currentRegion={region} currentSort={sort} currentPlatform={platform} currentSearch={search} />
                </div>
                {(search || platform || region || sort) && (
                  <div className="flex justify-start md:justify-end">
                    <Link href="/" className="flex items-center gap-1.5 text-sm text-[#007cff] font-medium hover:underline py-2 px-1">
                      <X className="h-4 w-4" />
                      <span>Clear filters</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {products.length > 0 ? (
              <div className={`grid ${
                config.catalogColumns === 2 ? 'grid-cols-2' :
                config.catalogColumns === 3 ? 'grid-cols-2 sm:grid-cols-3' :
                config.catalogColumns === 4 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' :
                config.catalogColumns === 5 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' :
                'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6'
              } gap-4 sm:gap-5`}>
                {products.map(p => <ProductCard key={p.id} {...p} />)}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#0a0e1a] rounded-xl border border-white/[0.04] flex flex-col items-center gap-4">
                <Search className="h-8 w-8 text-gray-700" />
                <div className="flex flex-col gap-1 max-w-sm">
                  <h3 className="text-base font-semibold text-gray-200">No results found</h3>
                  <p className="text-sm text-gray-500">Try different filters or search terms.</p>
                </div>
                <Link href="/" className="mt-1 px-5 py-2.5 bg-[#007cff] hover:bg-[#007cff]/90 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-[#007cff]/10">
                  Reset
                </Link>
              </div>
            )}
          </div>
        )}
      </section>

    </div>
  );
}

function Shelf({ title, subtitle, color, icon, link, products, cols }: {
  title: string; subtitle?: string; color: string; icon?: React.ReactNode; link: string; products: any[]; cols: number;
}) {
  const gridColsMap: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6',
  };
  const gridCols = gridColsMap[cols] || gridColsMap[4];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-1 h-5 rounded-full ${color}`} />
          <div>
            <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
              {icon}
              {title}
            </h2>
            {subtitle && <p className="text-[11px] text-gray-600 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <Link href={link} className="text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className={`grid ${gridCols} gap-4 sm:gap-5`}>
        {products.map(p => <ProductCard key={p.id} {...p} />)}
      </div>
    </div>
  );
}

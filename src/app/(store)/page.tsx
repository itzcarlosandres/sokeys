import React from 'react';
import { db } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import FilterSelect from '@/components/FilterSelect';
import KeyFeed from '@/components/KeyFeed';
import SafeImage from '@/components/SafeImage';
import {
  ShieldCheck, Zap, Headphones, Globe, ArrowRight, X, Sparkles, CheckCircle2,
  Star, Hexagon, TrendingUp, Clock, Search, CreditCard, RefreshCw, MessageSquare,
  Mail, ChevronRight, Flame, Tag, Trophy, Gamepad2, Monitor, Smartphone, Server,
  Cpu, HardDrive, Wifi, Key, Gift, Users, Shield, Lock, Database, Code, Bug,
  Terminal, Activity
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ search?: string; platform?: string; sort?: string; region?: string }>;
}

const PLATFORMS = [
  { name: "Windows", icon: Monitor, code: "WIN" },
  { name: "Office", icon: HardDrive, code: "OFF" },
  { name: "Security", icon: ShieldCheck, code: "SEC" },
  { name: "Server", icon: Server, code: "SRV" },
  { name: "SQL Server", icon: Database, code: "SQL" },
  { name: "Visual Studio", icon: Code, code: "VST" },
];

const BRANDS = [
  { name: "Microsoft", icon: Monitor },
  { name: "Kaspersky", icon: ShieldCheck },
  { name: "Norton", icon: Lock },
  { name: "Bitdefender", icon: Bug },
  { name: "ESET", icon: Cpu },
  { name: "Malwarebytes", icon: Shield },
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

  const config = await db.siteConfig.findUnique({ where: { id: 'default' } }) || { homeColumns: 4, homeFeaturedCount: 8, catalogColumns: 4, pointsPerDollar: 10 };
  const pointsPerDollar = config.pointsPerDollar || 10;

  const [recentProducts, hotProducts, featuredProduct] = isDefault ? await Promise.all([
    db.product.findMany({ take: 8, orderBy: { createdAt: 'desc' }, include: { badges: true, platformObj: true } }),
    db.product.findMany({ where: { isHot: true }, take: 4, orderBy: { createdAt: 'desc' }, include: { badges: true, platformObj: true } }),
    db.product.findFirst({ where: { isFeatured: true }, include: { badges: true, platformObj: true } }),
  ]) : [[], [], null];

  return (
    <div className="flex-1 flex flex-col bg-[#08090c]">

      {/* ─── HERO ─── */}
      {isDefault && (
        <section className="relative overflow-hidden border-b border-white/[0.04]">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-grid opacity-50" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

              {/* Left: thesis */}
              <div className="lg:col-span-7 flex flex-col gap-7">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[#9eb8d9]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9eb8d9] animate-pulse-dot" />
                    <span>delivery.live</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#6b7080]">est. 2024</span>
                </div>

                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium text-[#e8e6e1] leading-[0.95] tracking-[-0.03em]">
                  Original software
                  <br />
                  keys, delivered
                  <br />
                  <span className="text-[#9eb8d9]">in seconds.</span>
                </h1>

                <p className="font-body text-base text-[#6b7080] max-w-lg leading-relaxed">
                  Windows, Office, antivirus, games. Pay once, get your activation code by email, install and forget. No subscriptions, no accounts, no nonsense.
                </p>

                {/* Search */}
                <form action="/" className="w-full max-w-xl">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7080]" />
                    <input
                      type="text"
                      name="search"
                      defaultValue={search}
                      placeholder="Search Windows 11, Office 2021, Norton..."
                      className="w-full bg-[#0c0e14] border border-white/[0.06] hover:border-white/[0.10] focus:border-[#9eb8d9]/30 focus:outline-none text-sm text-[#e8e6e1] placeholder:text-[#6b7080] pl-11 pr-4 py-3.5 rounded-lg transition-colors"
                    />
                    {search && (
                      <Link href="/" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#6b7080] hover:text-[#e8e6e1]">
                        <X className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </form>

                {/* Quick filter chips */}
                <div className="flex flex-wrap items-center gap-2">
                  {PLATFORMS.slice(0, 5).map(p => {
                    const Icon = p.icon;
                    return (
                      <Link
                        key={p.name}
                        href={`/?platform=${p.name}`}
                        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium bg-[#0c0e14] border border-white/[0.06] hover:border-[#9eb8d9]/30 text-[#e8e6e1] hover:text-[#9eb8d9] transition-colors"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{p.name}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-px bg-white/[0.04] border border-white/[0.04] rounded-lg overflow-hidden max-w-xl">
                  {[
                    { k: '12.4k+', v: 'keys delivered' },
                    { k: '< 30s', v: 'avg. delivery' },
                    { k: '99.7%', v: 'validity rate' },
                  ].map(s => (
                    <div key={s.v} className="bg-[#08090c] px-4 py-3">
                      <div className="font-display text-2xl text-[#e8e6e1]">{s.k}</div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-[#6b7080] mt-0.5">{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: live key feed */}
              <div className="lg:col-span-5 lg:mt-2">
                <KeyFeed />

                {/* Promise list under feed */}
                <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[11px]">
                  {[
                    { icon: Zap, t: 'Instant delivery' },
                    { icon: ShieldCheck, t: 'Authentic keys' },
                    { icon: RefreshCw, t: 'Replacement guarantee' },
                    { icon: Headphones, t: '24/7 support' },
                  ].map(p => {
                    const Icon = p.icon;
                    return (
                      <div key={p.t} className="flex items-center gap-2 px-3 py-2 bg-[#0c0e14] border border-white/[0.04] rounded-md text-[#e8e6e1]">
                        <Icon className="h-3.5 w-3.5 text-[#9eb8d9]" />
                        <span>{p.t}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── CATEGORIES ─── */}
      {isDefault && (
        <section className="border-b border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#9eb8d9] mb-2">// 01 / Catalog</div>
                <h2 className="font-display text-2xl text-[#e8e6e1]">Browse by category</h2>
              </div>
              <Link href="/?search=" className="font-mono text-[11px] uppercase tracking-wider text-[#6b7080] hover:text-[#9eb8d9] transition-colors flex items-center gap-1.5">
                All categories <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {PLATFORMS.map(p => {
                const Icon = p.icon;
                return (
                  <Link
                    key={p.name}
                    href={`/?platform=${p.name}`}
                    className="group relative bg-[#0c0e14] border border-white/[0.04] hover:border-[#9eb8d9]/30 rounded-lg p-4 transition-all duration-300 lift overflow-hidden"
                  >
                    <div className="font-mono text-[10px] text-[#6b7080] mb-3">/{p.code}</div>
                    <div className="text-[#e8e6e1] group-hover:text-[#9eb8d9] transition-colors mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="font-display text-sm text-[#e8e6e1] group-hover:text-[#9eb8d9] transition-colors">
                      {p.name}
                    </div>
                    <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-[#9eb8d9] transition-all duration-500" />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── SHELVES ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        {isDefault ? (
          <div className="flex flex-col gap-16">

            {/* Recently Added */}
            {recentProducts.length > 0 && (
              <Shelf
                num="02"
                title="Recently added"
                subtitle="New keys just landed"
                link="/?sort=rating"
                products={recentProducts}
                cols={4}
                pointsPerDollar={pointsPerDollar}
              />
            )}

            {/* Hot products as compact list */}
            {hotProducts.length > 0 && (
              <div>
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-[#9eb8d9] mb-2">// 03 / Trending</div>
                    <h2 className="font-display text-2xl text-[#e8e6e1]">Hot this week</h2>
                  </div>
                  <Link href="/?search=hot" className="font-mono text-[11px] uppercase tracking-wider text-[#6b7080] hover:text-[#9eb8d9] transition-colors flex items-center gap-1.5">
                    See all <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="bg-[#0c0e14] border border-white/[0.04] rounded-lg divide-y divide-white/[0.04]">
                  {hotProducts.map((p, i) => (
                    <Link
                      key={p.id}
                      href={`/product/${p.slug}`}
                      className="group flex items-center gap-4 px-4 py-3.5 hover:bg-[#0f1218] transition-colors"
                    >
                      <span className="font-mono text-[10px] text-[#6b7080] w-6">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="relative w-11 h-11 rounded-md overflow-hidden border border-white/[0.04] bg-[#06080c] shrink-0">
                        <SafeImage src={p.image} alt={p.title} fill sizes="44px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#9eb8d9] border border-[#9eb8d9]/30 px-1.5 py-0.5 rounded">
                            hot
                          </span>
                          <span className="font-mono text-[10px] text-[#6b7080]">{p.platform}</span>
                        </div>
                        <h3 className="text-sm text-[#e8e6e1] group-hover:text-white truncate">{p.title}</h3>
                      </div>
                      <div className="text-right shrink-0 font-mono">
                        {p.originalPrice && (
                          <div className="text-[11px] text-[#6b7080] line-through">${p.originalPrice.toFixed(2)}</div>
                        )}
                        <div className="text-sm font-semibold text-[#e8e6e1]">${p.price.toFixed(2)}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#6b7080] group-hover:text-[#9eb8d9] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Brands grid */}
            <div>
              <div className="mb-6">
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#9eb8d9] mb-2">// 04 / Trusted</div>
                <h2 className="font-display text-2xl text-[#e8e6e1]">Official resellers</h2>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {BRANDS.map(b => {
                  const Icon = b.icon;
                  return (
                    <Link
                      key={b.name}
                      href={`/?search=${b.name}`}
                      className="group flex flex-col items-center gap-2.5 py-5 bg-[#0c0e14] border border-white/[0.04] hover:border-[#9eb8d9]/30 rounded-lg transition-all duration-300 lift"
                    >
                      <Icon className="h-5 w-5 text-[#6b7080] group-hover:text-[#9eb8d9] transition-colors" />
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#6b7080] group-hover:text-[#e8e6e1] transition-colors">
                        {b.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ─── FILTER VIEW ─── */
          <div className="flex flex-col gap-6 pb-16">
            <div className="flex items-end justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#9eb8d9] mb-2">// Catalog</div>
                <h2 className="font-display text-2xl text-[#e8e6e1]">
                  {search ? `"${search}"` : platform ? `Licencias ${platform}` : 'All software'}
                </h2>
              </div>
              {products.length > 0 && (
                <span className="font-mono text-[11px] text-[#6b7080]">
                  {products.length} results
                </span>
              )}
            </div>

            <div className="bg-[#0c0e14] border border-white/[0.04] p-5 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <FilterSelect currentRegion={region} currentSort={sort} currentPlatform={platform} currentSearch={search} />
                </div>
                {(search || platform || region || sort) && (
                  <div className="flex justify-start md:justify-end">
                    <Link href="/" className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[#9eb8d9] hover:underline py-2 px-1">
                      <X className="h-3.5 w-3.5" />
                      <span>Clear</span>
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
                {products.map(p => <ProductCard key={p.id} {...p} pointsPerDollar={pointsPerDollar} />)}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#0c0e14] rounded-lg border border-white/[0.04] flex flex-col items-center gap-4">
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#6b7080]">// 0 results</div>
                <h3 className="font-display text-xl text-[#e8e6e1]">Nothing here yet</h3>
                <p className="text-sm text-[#6b7080] max-w-sm">Try a different search or clear the filters.</p>
                <Link href="/" className="mt-1 px-5 py-2.5 bg-[#9eb8d9] hover:bg-[#b5c7e0] text-[#08090c] text-sm font-semibold rounded-md transition-colors">
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

function Shelf({ num, title, subtitle, link, products, cols, pointsPerDollar }: {
  num: string; title: string; subtitle?: string; link: string; products: any[]; cols: number; pointsPerDollar?: number;
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
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-[#9eb8d9] mb-2">// {num}</div>
          <h2 className="font-display text-2xl text-[#e8e6e1]">{title}</h2>
          {subtitle && <p className="font-body text-sm text-[#6b7080] mt-1">{subtitle}</p>}
        </div>
        <Link href={link} className="font-mono text-[11px] uppercase tracking-wider text-[#6b7080] hover:text-[#9eb8d9] transition-colors flex items-center gap-1.5">
          See all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className={`grid ${gridCols} gap-4 sm:gap-5`}>
        {products.map(p => <ProductCard key={p.id} {...p} pointsPerDollar={pointsPerDollar} />)}
      </div>
    </div>
  );
}

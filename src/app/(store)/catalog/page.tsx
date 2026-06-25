import React from 'react';
import { db } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import FilterSelect from '@/components/FilterSelect';
import SafeImage from '@/components/SafeImage';
import {
  Search, X, ArrowRight, Grid3x3, ListFilter, Package, Monitor,
  ShieldCheck, Server, Database, Code, HardDrive
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface CatalogProps {
  searchParams: Promise<{ search?: string; platform?: string; sort?: string; region?: string; type?: string }>;
}

const PLATFORM_FILTERS = [
  { name: "Windows", icon: Monitor, code: "WIN" },
  { name: "Office", icon: HardDrive, code: "OFF" },
  { name: "Security", icon: ShieldCheck, code: "SEC" },
  { name: "Server", icon: Server, code: "SRV" },
  { name: "SQL Server", icon: Database, code: "SQL" },
  { name: "Visual Studio", icon: Code, code: "VST" },
];

const REGIONS = ['GLOBAL', 'EUROPE', 'NORTH AMERICA', 'LATAM', 'ASIA'];

export default async function CatalogPage({ searchParams }: CatalogProps) {
  const params = await searchParams;
  const search = params.search || '';
  const platform = params.platform || '';
  const sort = params.sort || '';
  const region = params.region || '';
  const type = params.type || '';

  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { genre: { contains: search } },
    ];
  }
  if (platform) where.platform = { contains: platform };
  if (region) where.region = region;
  if (type) where.type = { contains: type };

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price-asc') orderBy = { price: 'asc' };
  else if (sort === 'price-desc') orderBy = { price: 'desc' };
  else if (sort === 'rating') orderBy = { rating: 'desc' };
  else if (sort === 'popular') orderBy = { rating: 'desc' };

  const products = await db.product.findMany({
    where,
    orderBy,
    include: { badges: true, platformObj: true },
  });

  const config = await db.siteConfig.findUnique({ where: { id: 'default' } }) || { catalogColumns: 4, pointsPerDollar: 10 };
  const pointsPerDollar = config.pointsPerDollar || 10;
  const cols = config.catalogColumns || 4;

  const gridColsMap: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6',
  };
  const gridCols = gridColsMap[cols] || gridColsMap[4];

  // Count active filters
  const activeFilters: { label: string; param: string; value: string }[] = [];
  if (search) activeFilters.push({ label: `search: "${search}"`, param: 'search', value: search });
  if (platform) activeFilters.push({ label: `platform: ${platform}`, param: 'platform', value: platform });
  if (region) activeFilters.push({ label: `region: ${region}`, param: 'region', value: region });
  if (type) activeFilters.push({ label: `type: ${type}`, param: 'type', value: type });
  if (sort) activeFilters.push({ label: `sort: ${sort}`, param: 'sort', value: sort });

  // Build clear-all URL
  const clearAllParams = new URLSearchParams();
  if (search) clearAllParams.set('search', search);
  const clearAllUrl = `/catalog${clearAllParams.toString() ? '?' + clearAllParams.toString() : ''}`;

  // Build "remove this filter" URLs
  const removeFilterUrl = (param: string) => {
    const sp = new URLSearchParams();
    if (search && param !== 'search') sp.set('search', search);
    if (platform && param !== 'platform') sp.set('platform', platform);
    if (region && param !== 'region') sp.set('region', region);
    if (type && param !== 'type') sp.set('type', type);
    if (sort && param !== 'sort') sp.set('sort', sort);
    return `/catalog${sp.toString() ? '?' + sp.toString() : ''}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#08090c]">

      {/* ─── HEADER ─── */}
      <section className="relative border-b border-white/[0.04]">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col gap-6">
            {/* Eyebrow row */}
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-wider">
              <span className="text-[#9eb8d9]">// Catalog</span>
              <span className="text-[#6b7080]">/all</span>
              <span className="ml-auto text-[#6b7080] tabular-nums">
                &gt; {products.length.toString().padStart(3, '0')} keys
              </span>
            </div>

            {/* Title */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h1 className="font-display text-4xl sm:text-5xl text-[#e8e6e1] tracking-[-0.03em]">
                The full library
              </h1>
              <form action="/catalog" method="GET" className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7080]" />
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Search keys..."
                  className="w-full bg-[#0c0e14] border border-white/[0.06] hover:border-white/[0.10] focus:border-[#9eb8d9]/30 focus:outline-none text-sm text-[#e8e6e1] placeholder:text-[#6b7080] pl-10 pr-4 py-2.5 rounded-md transition-colors font-mono"
                />
              </form>
            </div>

            <p className="font-body text-sm text-[#6b7080] max-w-2xl">
              Every license we sell, in one place. Filter by platform, region, or type. Each key is delivered by email within seconds of payment.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FILTER BAR ─── */}
      <section className="sticky top-0 z-20 bg-[#08090c]/85 backdrop-blur-md border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#6b7080] mr-1">
              <ListFilter className="h-3.5 w-3.5" />
              filter
            </div>

            {/* Platform chips */}
            {PLATFORM_FILTERS.map(p => {
              const Icon = p.icon;
              const active = platform === p.name;
              const url = active ? removeFilterUrl('platform') : `/catalog?${new URLSearchParams({ ...(search && { search }), ...(region && { region }), platform: p.name }).toString()}`;
              return (
                <Link
                  key={p.name}
                  href={url}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-wider border transition-colors ${
                    active
                      ? 'bg-[#9eb8d9]/10 border-[#9eb8d9]/40 text-[#9eb8d9]'
                      : 'bg-[#0c0e14] border-white/[0.06] text-[#6b7080] hover:text-[#e8e6e1] hover:border-white/[0.10]'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  /{p.code}
                </Link>
              );
            })}

            <div className="h-4 w-px bg-white/[0.06] mx-1" />

            {/* Region chips */}
            {REGIONS.slice(0, 4).map(r => {
              const active = region === r;
              const url = active ? removeFilterUrl('region') : `/catalog?${new URLSearchParams({ ...(search && { search }), ...(platform && { platform }), region: r }).toString()}`;
              return (
                <Link
                  key={r}
                  href={url}
                  className={`px-2.5 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-wider border transition-colors ${
                    active
                      ? 'bg-[#9eb8d9]/10 border-[#9eb8d9]/40 text-[#9eb8d9]'
                      : 'bg-[#0c0e14] border-white/[0.06] text-[#6b7080] hover:text-[#e8e6e1] hover:border-white/[0.10]'
                  }`}
                >
                  {r}
                </Link>
              );
            })}

            <div className="ml-auto">
              <FilterSelect
                currentRegion={region}
                currentSort={sort}
                currentPlatform={platform}
                currentSearch={search}
              />
            </div>
          </div>

          {/* Active filters row */}
          {activeFilters.length > 0 && (
            <div className="mt-3 flex items-center gap-2 flex-wrap font-mono text-[10px]">
              <span className="text-[#6b7080] uppercase tracking-wider">active:</span>
              {activeFilters.map(f => (
                <Link
                  key={f.param}
                  href={removeFilterUrl(f.param)}
                  className="group flex items-center gap-1.5 px-2 py-1 bg-[#9eb8d9]/[0.06] border border-[#9eb8d9]/20 rounded text-[#9eb8d9] hover:bg-[#9eb8d9]/10 transition-colors"
                >
                  <span className="uppercase tracking-wider">{f.label}</span>
                  <X className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </Link>
              ))}
              {activeFilters.length > 1 && (
                <Link
                  href={clearAllUrl}
                  className="text-[#6b7080] hover:text-[#e8e6e1] uppercase tracking-wider transition-colors ml-1"
                >
                  clear all
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── GRID ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10">
        {products.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6 font-mono text-[10px] uppercase tracking-wider text-[#6b7080]">
              <span>
                &gt; showing {products.length} {products.length === 1 ? 'result' : 'results'}
                {search && <span className="text-[#9eb8d9]"> for "{search}"</span>}
              </span>
              {sort && <span className="text-[#9eb8d9]">sorted by {sort}</span>}
            </div>

            <div className={`grid ${gridCols} gap-4 sm:gap-5`}>
              {products.map(p => (
                <ProductCard key={p.id} {...p} pointsPerDollar={pointsPerDollar} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24 bg-[#0c0e14] border border-white/[0.04] rounded-lg flex flex-col items-center gap-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-[#6b7080]">
              // 0 results
            </div>
            <Package className="h-8 w-8 text-[#1c1f28]" />
            <div className="flex flex-col gap-1 max-w-sm">
              <h3 className="font-display text-xl text-[#e8e6e1]">Nothing in the library yet</h3>
              <p className="text-sm text-[#6b7080]">
                No keys match these filters. Try removing one, or clear all to start fresh.
              </p>
            </div>
            {activeFilters.length > 0 && (
              <Link
                href="/catalog"
                className="mt-2 px-5 py-2.5 bg-[#9eb8d9] hover:bg-[#b5c7e0] text-[#08090c] text-sm font-mono font-semibold rounded-md transition-colors"
              >
                Clear filters
              </Link>
            )}
          </div>
        )}
      </section>

    </div>
  );
}

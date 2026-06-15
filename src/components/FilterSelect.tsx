"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface FilterSelectProps {
  currentRegion: string;
  currentSort: string;
  currentPlatform: string;
  currentSearch: string;
}

export default function FilterSelect({
  currentRegion,
  currentSort,
  currentPlatform,
  currentSearch,
}: FilterSelectProps) {
  const router = useRouter();

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const r = e.target.value;
    const rQuery = r === 'All' ? '' : `region=${encodeURIComponent(r)}`;
    const pQuery = currentPlatform ? `platform=${encodeURIComponent(currentPlatform)}` : '';
    const sQuery = currentSearch ? `search=${encodeURIComponent(currentSearch)}` : '';
    const sortQuery = currentSort ? `sort=${encodeURIComponent(currentSort)}` : '';
    
    const query = [rQuery, pQuery, sQuery, sortQuery].filter(Boolean).join('&');
    router.push(query ? `/?${query}` : '/');
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const s = e.target.value;
    const sortQuery = s ? `sort=${encodeURIComponent(s)}` : '';
    const rQuery = currentRegion && currentRegion !== 'All' ? `region=${encodeURIComponent(currentRegion)}` : '';
    const pQuery = currentPlatform ? `platform=${encodeURIComponent(currentPlatform)}` : '';
    const sQuery = currentSearch ? `search=${encodeURIComponent(currentSearch)}` : '';
    
    const query = [sortQuery, rQuery, pQuery, sQuery].filter(Boolean).join('&');
    router.push(query ? `/?${query}` : '/');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 w-full">
      {/* Region dropdown filter */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Región de Activación</span>
        <select
          value={currentRegion || 'All'}
          onChange={handleRegionChange}
          className="w-full bg-[#1e2535] border border-[#2e374c] text-xs font-bold text-gray-300 py-2.5 px-3 rounded-lg focus:outline-none focus:border-accent-orange"
        >
          <option value="All">Cualquier Región</option>
          <option value="Global">Global / Libre</option>
          <option value="US">Estados Unidos (US)</option>
          <option value="Europe">Europa (EU)</option>
          <option value="Latam">Latinoamérica (Latam)</option>
        </select>
      </div>

      {/* Sort dropdown */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Ordenar por</span>
        <select
          value={currentSort}
          onChange={handleSortChange}
          className="w-full bg-[#1e2535] border border-[#2e374c] text-xs font-bold text-gray-300 py-2.5 px-3 rounded-lg focus:outline-none focus:border-accent-orange"
        >
          <option value="">Recomendados</option>
          <option value="price-asc">Precio: de menor a mayor</option>
          <option value="price-desc">Precio: de mayor a menor</option>
          <option value="rating">Puntaje / Calificación</option>
        </select>
      </div>
    </div>
  );
}

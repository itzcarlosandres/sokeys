import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "PixelCodes | Consola Administrativa",
  description: "Panel de control interno para la gestión del catálogo de licencias.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#05070a] text-gray-200 selection:bg-[#007cff]/30 selection:text-white">
      {children}
    </div>
  );
}

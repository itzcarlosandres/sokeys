import React from 'react';
import Link from 'next/link';
import { Hexagon, ShieldCheck, Zap, Heart, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#05070a] border-t border-white/[0.04] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#007cff] to-blue-600 flex items-center justify-center shadow-lg shadow-[#007cff]/20">
                <Hexagon className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold tracking-tight text-white">Pixel<span className="text-[#007cff]">Codes</span></span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Tienda premium de licencias de software originales. Claves de activación oficiales con entrega instantánea y soporte prioritario.
            </p>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Garantía de Activación</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Zap className="h-4 w-4 text-[#007cff]" />
                <span>Entrega Instantánea</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Plataformas</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-500">
              <li><Link href="/?platform=Windows" className="hover:text-gray-300 transition-colors">Windows License Keys</Link></li>
              <li><Link href="/?platform=Office" className="hover:text-gray-300 transition-colors">Microsoft Office Keys</Link></li>
              <li><Link href="/?platform=Security" className="hover:text-gray-300 transition-colors">Antivirus & Security</Link></li>
              <li><Link href="/?platform=Server" className="hover:text-gray-300 transition-colors">Windows Server Keys</Link></li>
              <li><Link href="/?search=SQL" className="hover:text-gray-300 transition-colors">SQL Server Licenses</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Soporte</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-gray-500">
              <li><span className="hover:text-gray-300 transition-colors cursor-pointer">Centro de Ayuda</span></li>
              <li><span className="hover:text-gray-300 transition-colors cursor-pointer">Guía de Activación</span></li>
              <li><span className="hover:text-gray-300 transition-colors cursor-pointer">Política de Reembolso</span></li>
              <li><span className="hover:text-gray-300 transition-colors cursor-pointer">Términos del Servicio</span></li>
              <li><span className="hover:text-gray-300 transition-colors cursor-pointer">Contacto</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Pago Seguro</h3>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
              Todos los pagos son procesados de forma cifrada con SSL de grado bancario.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 bg-[#04060a] border border-white/[0.04] rounded text-xs font-medium text-gray-500">VISA</span>
              <span className="px-2.5 py-1 bg-[#04060a] border border-white/[0.04] rounded text-xs font-medium text-gray-500">MC</span>
              <span className="px-2.5 py-1 bg-[#04060a] border border-white/[0.04] rounded text-xs font-medium text-gray-500">PAYPAL</span>
              <span className="px-2.5 py-1 bg-[#04060a] border border-white/[0.04] rounded text-xs font-medium text-gray-500">APPLE PAY</span>
            </div>
          </div>

        </div>

        <div className="border-t border-white/[0.04] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} PixelCodes. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1">
            <span>Hecho con</span>
            <Heart className="h-3 w-3 text-red-500/70" />
            <span>y Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import Link from 'next/link';
import { Hexagon, ShieldCheck, Zap, Lock, ArrowUpRight, CornerDownLeft } from 'lucide-react';

const KEY_SEGMENTS = ['PX9C', '7K2M', '4F8N', 'V2TQ', '8B1R', 'D6X5'];
const BUILD = '#48219';
const VERSION = 'v2.4.1';
const UPTIME = '99.98%';

export default function Footer() {
  return (
    <footer className="relative bg-[#06080d] border-t border-white/[0.05] mt-auto overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9eb8d9]/30 to-transparent" aria-hidden />

      <section
        aria-label="Estado del servicio"
        className="relative border-b border-white/[0.05] bg-[#0a0d14]"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60" aria-hidden>
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#9eb8d9]/15 to-transparent animate-scan" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6 py-3 font-mono text-[11px] sm:text-xs">
            <div className="flex items-center gap-2 shrink-0 text-[#9eb8d9]/80">
              <span className="inline-block w-2 h-3.5 bg-[#9eb8d9]/70 animate-cursor-blink" aria-hidden />
              <span className="tracking-[0.18em] uppercase">Issued</span>
            </div>

            <div className="hidden md:flex flex-1 items-center justify-center min-w-0">
              <code className="flex items-center gap-1.5 sm:gap-2 text-[#e8e6e1]/85 tracking-[0.22em] select-all truncate">
                {KEY_SEGMENTS.map((seg, i) => (
                  <React.Fragment key={seg}>
                    <span className={i === 0 ? 'text-[#9eb8d9]' : undefined}>{seg}</span>
                    {i < KEY_SEGMENTS.length - 1 && (
                      <span className="text-[#e8e6e1]/25" aria-hidden>·</span>
                    )}
                  </React.Fragment>
                ))}
              </code>
            </div>

            <div className="flex md:hidden flex-1 items-center min-w-0">
              <code className="text-[#e8e6e1]/70 tracking-[0.22em] truncate">
                {KEY_SEGMENTS.join('-')}
              </code>
            </div>

            <div className="hidden sm:flex items-center gap-3 shrink-0 text-[#e8e6e1]/55">
              <span className="flex items-center gap-1.5">
                <span className="relative inline-flex">
                  <span className="absolute inset-0 rounded-full bg-[#7be3b0]/40 animate-pulse-dot" />
                  <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-[#7be3b0]" />
                </span>
                <span className="tracking-[0.18em] uppercase text-[#7be3b0]/80">Online</span>
              </span>
              <span className="text-[#e8e6e1]/20" aria-hidden>/</span>
              <span className="tracking-[0.18em] uppercase">
                Status <span className="text-[#e8e6e1]/85">Verified</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          <div className="lg:col-span-4 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-[#0c1018] border border-white/[0.06] flex items-center justify-center group-hover:border-[#9eb8d9]/40 transition-colors">
                <Hexagon className="h-4 w-4 text-[#9eb8d9]" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold tracking-tight text-[#e8e6e1]">
                  Pixel<span className="text-[#9eb8d9]">Codes</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#e8e6e1]/40 mt-1">
                  Licencias · {VERSION}
                </span>
              </div>
            </Link>

            <p className="text-sm text-[#e8e6e1]/55 leading-relaxed max-w-sm">
              Tienda premium de licencias de software originales. Claves de activación oficiales con entrega
              instantánea y soporte prioritario.
            </p>

            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#e8e6e1]/50">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#7be3b0]" strokeWidth={1.75} />
                <span>Garantía</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-[#9eb8d9]" strokeWidth={1.75} />
                <span>Entrega 0–60s</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[#e8e6e1]/60" strokeWidth={1.75} />
                <span>Pago cifrado</span>
              </li>
            </ul>
          </div>

          <FooterColumn
            prompt="01"
            title="Plataformas"
            links={[
              { label: 'Windows License Keys', href: '/?platform=Windows' },
              { label: 'Microsoft Office Keys', href: '/?platform=Office' },
              { label: 'Antivirus & Security', href: '/?platform=Security' },
              { label: 'Windows Server Keys', href: '/?platform=Server' },
              { label: 'SQL Server Licenses', href: '/?search=SQL' },
            ]}
            className="lg:col-span-2"
          />

          <FooterColumn
            prompt="02"
            title="Soporte"
            links={[
              { label: 'Centro de Ayuda', href: '/soporte' },
              { label: 'Guía de Activación', href: '/soporte/activacion' },
              { label: 'Política de Reembolso', href: '/soporte/reembolso' },
              { label: 'Términos del Servicio', href: '/legal/terminos' },
              { label: 'Política de Privacidad', href: '/legal/privacidad' },
              { label: 'Contacto', href: '/soporte/contacto' },
            ]}
            className="lg:col-span-2"
          />

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div>
              <SectionHeading prompt="03">Pago</SectionHeading>
              <p className="text-sm text-[#e8e6e1]/55 leading-relaxed mb-4 max-w-xs">
                Transacciones procesadas con SSL de grado bancario. Nunca almacenamos datos de tarjeta.
              </p>
              <ul className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.18em]">
                {['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'].map((m) => (
                  <li
                    key={m}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#0a0d14] border border-white/[0.05] text-[#e8e6e1]/70"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7be3b0]" aria-hidden />
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeading prompt="04">Changelog</SectionHeading>
              <p className="text-sm text-[#e8e6e1]/55 leading-relaxed mb-3 max-w-xs">
                Avisos de restock, ofertas y nuevos productos. Cero spam, baja con un click.
              </p>
              <form
                action="#"
                method="post"
                className="group flex items-center gap-2 border-b border-white/[0.08] focus-within:border-[#9eb8d9]/60 transition-colors pb-1.5"
              >
                <span className="font-mono text-sm text-[#9eb8d9]/70 select-none" aria-hidden>{'>'}</span>
                <label htmlFor="footer-newsletter" className="sr-only">Correo electrónico</label>
                <input
                  id="footer-newsletter"
                  type="email"
                  name="email"
                  required
                  placeholder="tu@correo.com"
                  className="flex-1 min-w-0 bg-transparent font-mono text-sm text-[#e8e6e1] placeholder:text-[#e8e6e1]/25 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Suscribirse"
                  className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#e8e6e1]/60 hover:text-[#9eb8d9] transition-colors"
                >
                  <span className="hidden sm:inline">Enviar</span>
                  <CornerDownLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.05] bg-[#05070b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#e8e6e1]/40">
            <p>
              © {new Date().getFullYear()} PixelCodes
              <span className="mx-2 text-[#e8e6e1]/20" aria-hidden>//</span>
              Build {BUILD}
            </p>
            <p className="flex items-center gap-2">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7be3b0]" aria-hidden />
                Uptime {UPTIME}
              </span>
              <span className="text-[#e8e6e1]/20" aria-hidden>//</span>
              <span>{VERSION}</span>
              <span className="text-[#e8e6e1]/20" aria-hidden>//</span>
              <Link href="/legal/terminos" className="hover:text-[#9eb8d9] transition-colors inline-flex items-center gap-1">
                Términos
                <ArrowUpRight className="h-3 w-3" strokeWidth={1.75} />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SectionHeading({
  prompt,
  children,
}: {
  prompt: string;
  children: React.ReactNode;
}) {
  return (
    <h3 className="flex items-center gap-2 mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#9eb8d9]/70">
      <span aria-hidden className="text-[#e8e6e1]/30">{'>'}</span>
      <span aria-hidden className="text-[#e8e6e1]/30">{prompt}</span>
      <span className="text-[#e8e6e1]">{children}</span>
    </h3>
  );
}

function FooterColumn({
  prompt,
  title,
  links,
  className = '',
}: {
  prompt: string;
  title: string;
  links: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <SectionHeading prompt={prompt}>{title}</SectionHeading>
      <ul className="flex flex-col gap-2.5 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-[#e8e6e1]/55 hover:text-[#e8e6e1] transition-colors focus-visible:outline-none focus-visible:text-[#9eb8d9]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

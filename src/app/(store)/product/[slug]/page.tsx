import React from 'react';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';
import ProductActions from '@/components/ProductActions';
import { ArrowLeft, Globe, HelpCircle, ShieldCheck, Star, Terminal, Zap, Gift } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Await params in Next.js 15+
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Fetch product from DB with its keys
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      keys: {
        where: { isSold: false }
      }
    }
  });

  if (!product) {
    notFound();
  }

  const stockCount = product.keys.length;

  // Get points per dollar from config
  const config = await db.siteConfig.findUnique({ where: { id: 'default' } });
  const pointsPerDollar = config?.pointsPerDollar || 10;
  const pointsEarned = Math.floor(product.price * pointsPerDollar);

  // Activation Guide details based on platform
  const getActivationGuide = (platform: string) => {
    const norm = platform.toLowerCase();
    if (norm.includes('steam')) {
      return {
        steps: [
          "Descarga e instala el cliente de Steam en tu PC si aún no lo has hecho.",
          "Inicia sesión con tu cuenta de Steam o crea una nueva.",
          "Haz clic en el menú 'Productos' en la parte superior izquierda.",
          "Selecciona 'Activar un producto en Steam...'.",
          "Ingresa el código que te entregamos al completar tu pago y haz clic en Siguiente.",
          "¡Listo! El juego se agregará a tu Biblioteca y podrás descargarlo."
        ],
        icon: "🎮 Steam Activation"
      };
    } else if (norm.includes('xbox') || norm.includes('pc')) {
      return {
        steps: [
          "Inicia sesión en tu consola Xbox o en tu PC con Windows.",
          "Abre la Microsoft Store.",
          "Haz clic en tu perfil de usuario o en el menú lateral y selecciona 'Canjear código'.",
          "Ingresa los 25 caracteres de la clave suministrada.",
          "Confirma la activación haciendo clic en 'Canjear'.",
          "¡Todo listo! El título comenzará a descargarse de inmediato."
        ],
        icon: "🟢 Xbox & PC Activation"
      };
    } else if (norm.includes('playstation') || norm.includes('ps')) {
      return {
        steps: [
          "Enciende tu consola PlayStation e inicia sesión en tu cuenta de PlayStation Network.",
          "Abre la PlayStation Store.",
          "Desplázate hacia abajo en la barra lateral izquierda y selecciona 'Canjear códigos'.",
          "Ingresa con cuidado la clave de 12 dígitos.",
          "Selecciona Canjear para acreditar la licencia del juego en tu cuenta.",
          "¡Listo! Accede a tu Biblioteca de juegos para comenzar la descarga."
        ],
        icon: "🔵 PlayStation Store Activation"
      };
    } else if (norm.includes('nintendo')) {
      return {
        steps: [
          "Enciende tu consola Nintendo Switch y conéctala a Internet.",
          "Inicia la Nintendo eShop desde el menú HOME.",
          "Selecciona la cuenta con la que deseas canjear el juego.",
          "Haz clic en 'Canjear código' en la barra lateral izquierda de la tienda.",
          "Ingresa el código de 16 caracteres entregado.",
          "¡Completo! El juego comenzará a descargarse automáticamente en tu consola."
        ],
        icon: "🔴 Nintendo eShop Activation"
      };
    } else {
      return {
        steps: [
          "Inicia sesión en la plataforma de activación del desarrollador correspondiente.",
          "Dirígete a la sección de tu Perfil o Cuenta.",
          "Busca la opción 'Canjear clave', 'Activar código' o 'Añadir licencia'.",
          "Ingresa la clave que te entregamos tras tu compra.",
          "Confirma para validar el juego en tu cuenta."
        ],
        icon: "🔑 Digital Key Activation"
      };
    }
  };

  const activationGuide = getActivationGuide(product.platform);

  return (
    <div className="flex-1 flex flex-col bg-[#080a0f]">
      
      {/* Dynamic blurred hero backdrop */}
      <div className="relative w-full h-[250px] sm:h-[350px] overflow-hidden border-b border-[#1e2535]">
        <SafeImage
          src={product.bannerImage || product.image}
          alt={product.title}
          fill
          sizes="100vw"
          className="object-cover filter blur-[35px] scale-110 opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a0f] via-transparent to-black/60" />
        
        {/* Breadcrumb / Back button */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-6">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-[#11141d]/80 hover:bg-[#1e2535] text-xs font-bold text-gray-300 rounded-lg border border-[#1e2535] hover:border-accent-orange transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver a la Tienda</span>
          </Link>
        </div>
      </div>

      {/* Main product view */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-[-60px] sm:mt-[-100px] z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Media, Info & Description */}
          <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-8">
            
            {/* Main Cover Card */}
            <div className="bg-[#11141d] border border-[#1e2535] p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-6">
              {/* Box Art image */}
              <div className="relative w-full sm:w-[200px] aspect-[14/10] sm:aspect-[3/4] rounded-xl overflow-hidden border border-[#1e2535] shrink-0 bg-[#080a0f]">
                <SafeImage
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 200px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Basic Meta Details */}
              <div className="flex flex-col justify-between py-1">
                <div className="flex flex-col gap-3">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wider">
                    <span className="bg-accent-purple/10 border border-accent-purple/30 text-accent-purple px-2.5 py-1 rounded-md">
                      {product.platform}
                    </span>
                    <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-2.5 py-1 rounded-md flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" />
                      {product.region}
                    </span>
                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-md flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Original Key
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                    {product.title}
                  </h1>

                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-white text-sm">{product.rating.toFixed(1)}</span>
                      <span className="text-gray-500">/ 5</span>
                    </div>
                    <span>•</span>
                    <span>Género: <span className="text-gray-200">{product.genre}</span></span>
                  </div>
                </div>

                <div className="border-t border-[#1e2535]/50 mt-4 pt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <div>Tipo: <span className="font-bold text-gray-300">{product.type}</span></div>
                  <span>•</span>
                  <div>Soporte: <span className="font-bold text-emerald-500">Garantía Activa 24/7</span></div>
                </div>
              </div>
            </div>

            {/* Game Description */}
            <div className="bg-[#11141d] border border-[#1e2535] p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1 bg-accent-orange h-5 rounded-full" />
                <h2 className="text-sm font-black uppercase tracking-wider text-white">Sobre este juego</h2>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line font-medium">
                {product.description}
              </p>
            </div>

            {/* Activation Guide Card */}
            <div className="bg-[#11141d] border border-[#1e2535] p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#1e2535]/50 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 bg-accent-purple h-5 rounded-full" />
                  <h2 className="text-sm font-black uppercase tracking-wider text-white">Instrucciones de activación</h2>
                </div>
                <span className="text-xs bg-[#1e2535] border border-[#2e374c] px-2.5 py-1 rounded text-gray-300 font-bold">
                  {activationGuide.icon}
                </span>
              </div>
              
              <ol className="flex flex-col gap-4 mt-1">
                {activationGuide.steps.map((step, index) => (
                  <li key={index} className="flex gap-4 items-start">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-[#1e2535] border border-[#2e374c] text-xs font-bold text-accent-orange shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-400 font-semibold pt-0.5 leading-relaxed">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

          </div>

          {/* Right Side: Pricing & CTA actions column */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <ProductActions product={product} stockCount={stockCount} />

            {/* Points badge */}
            <div className="mt-4 p-4 bg-[#6c5ce7]/10 border border-[#6c5ce7]/30 rounded-2xl flex items-center gap-3 text-sm">
              <Gift className="h-5 w-5 text-[#6c5ce7] shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-white">Ganás {pointsEarned} puntos</span>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Por esta compra recibirás {pointsEarned} puntos que podrás canjear por descuentos.
                </p>
              </div>
            </div>
            
            {/* Fast safety tip */}
            <div className="mt-4 p-4 bg-accent-orange/5 border border-accent-orange/10 rounded-2xl flex items-start gap-3 text-xs">
              <HelpCircle className="h-5 w-5 text-accent-orange shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <span className="font-extrabold text-white">¿Cómo recibo mi clave?</span>
                <p className="text-gray-500 leading-relaxed">
                  Inmediatamente después de completar el pago, la clave del producto se mostrará en tu pantalla y se guardará en tu sección <strong>&quot;Mis Compras&quot;</strong>.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

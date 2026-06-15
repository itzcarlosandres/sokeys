const { PrismaClient } = require('@prisma/client');
const { randomBytes, pbkdf2Sync } = require('crypto');
const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

const softwareProducts = [
  // ─── WINDOWS & OFFICE ───
  {
    title: "Windows 11 Pro — Retail Perpetuo",
    slug: "microsoft-windows-11-pro-retail",
    description: "Licencia oficial perpetua de Windows 11 Pro con activación inmediata. Incluye BitLocker, Hyper-V, Sandbox y todas las herramientas profesionales. Soporte vitalicio y actualizaciones de seguridad garantizadas.",
    price: 9.90,
    originalPrice: 149.00,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    platform: "Windows",
    region: "GLOBAL",
    type: "Software",
    rating: 4.9,
    genre: "Operating Systems",
    sellerName: "Microsoft Authorized Partner",
    isFeatured: true,
    isHot: true,
    isRecent: true,
    isPopular: true,
    isBestSeller: true,
    isOnSale: true,
    platformSlug: "windows",
    badgeSlugs: ["best-value", "official"],
    keys: ["W11P-23KJ-8FHD-RT7Y", "W11P-9XNM-BV3R-TY45", "W11P-LP28-KJ9H-DG67", "W11P-QW56-MN82-XCVB"]
  },
  {
    title: "Windows 10 Home — Retail Original",
    slug: "microsoft-windows-10-home-retail",
    description: "El sistema operativo más confiable para uso doméstico. Arranque rápido, menú Inicio mejorado y compatibilidad total con aplicaciones y hardware existentes.",
    price: 7.50,
    originalPrice: 119.00,
    image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=600&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
    platform: "Windows",
    region: "GLOBAL",
    type: "Software",
    rating: 4.8,
    genre: "Operating Systems",
    sellerName: "KeysDepot",
    isFeatured: false,
    isHot: false,
    isRecent: false,
    isPopular: true,
    isBestSeller: true,
    isOnSale: true,
    keys: ["W10H-RT45-KL89-MN23", "W10H-RT67-BV45-XC89", "W10H-RT12-QW34-SD56"]
  },
  {
    title: "Windows 10 Pro — OEM Original",
    slug: "microsoft-windows-10-pro-oem",
    description: "Clave OEM vinculada a tu placa base. Ideal para nuevos ensamblajes. Incluye BitLocker, DirectAccess y todas las ventajas de la edición Pro a precio imbatible.",
    price: 8.90,
    originalPrice: 139.00,
    image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
    platform: "Windows",
    region: "GLOBAL",
    type: "Software",
    rating: 4.9,
    genre: "Operating Systems",
    sellerName: "OEM Masters",
    isFeatured: true,
    isHot: false,
    isRecent: false,
    isPopular: true,
    isBestSeller: true,
    isOnSale: true,
    keys: ["W10P-OEM-8KJD-MN45", "W10P-OEM-3BVC-XZ67", "W10P-OEM-5NML-QW23"]
  },
  {
    title: "Office 365 Family — 1 Año / 6 Usuarios",
    slug: "microsoft-office-365-family-1-year",
    description: "Suscripción anual para hasta 6 personas. Word, Excel, PowerPoint, Outlook, OneNote + 1 TB de OneDrive por usuario. La suite completa para toda la familia.",
    price: 89.00,
    originalPrice: 149.00,
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80",
    platform: "Office",
    region: "Europe",
    type: "Software",
    rating: 4.7,
    genre: "Office & Productivity",
    sellerName: "OfficeDistri EU",
    isFeatured: true,
    isHot: true,
    isRecent: true,
    isPopular: true,
    isBestSeller: true,
    isOnSale: true,
    keys: ["O365-FAM-YR01-EU78", "O365-FAM-YR02-EU45", "O365-FAM-YR03-EU12"]
  },
  {
    title: "Office Pro Plus 2021 — Retail BIND",
    slug: "microsoft-office-pro-plus-2021-retail-bind",
    description: "Licencia perpetua vinculable a tu cuenta Microsoft. Word, Excel, PowerPoint, Outlook, Access y Publisher sin cuotas recurrentes. Activación instantánea.",
    price: 22.00,
    originalPrice: 299.00,
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
    platform: "Office",
    region: "GLOBAL",
    type: "Software",
    rating: 4.9,
    genre: "Office & Productivity",
    sellerName: "FastKeys Official",
    isFeatured: true,
    isHot: true,
    isRecent: true,
    isPopular: true,
    isBestSeller: true,
    isOnSale: true,
    keys: ["OPP21-BND-7KLM-QW34", "OPP21-BND-2XCV-BN56", "OPP21-BND-9HJK-SD78"]
  },
  {
    title: "Office Professional 2024 — Perpetuo",
    slug: "microsoft-office-2024-professional-plus",
    description: "La suite más reciente de Microsoft lanzada en 2024. Herramientas de IA integradas, análisis avanzado en Excel y transiciones mejoradas en PowerPoint. Licencia de por vida.",
    price: 29.90,
    originalPrice: 419.00,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80",
    platform: "Office",
    region: "GLOBAL",
    type: "Software",
    rating: 4.9,
    genre: "Office & Productivity",
    sellerName: "FastKeys Official",
    isFeatured: true,
    isHot: false,
    isRecent: true,
    isPopular: true,
    isBestSeller: true,
    isOnSale: true,
    keys: ["OPP24-PERP-4RTY-BN12", "OPP24-PERP-7MNB-XC34", "OPP24-PERP-1KLM-QW56"]
  },
  {
    title: "Visio Professional 2021 — Retail",
    slug: "microsoft-visio-professional-2021",
    description: "Crea diagramas, flujos de proceso y organigramas profesionales. Ideal para ingenieros, arquitectos y equipos de project management. Licencia perpetua.",
    price: 19.90,
    originalPrice: 589.00,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1542744173-8e0856278d90?w=1200&auto=format&fit=crop&q=80",
    platform: "Office",
    region: "GLOBAL",
    type: "Software",
    rating: 4.7,
    genre: "Office & Productivity",
    sellerName: "FastKeys Official",
    isFeatured: false,
    isHot: false,
    isRecent: true,
    isPopular: false,
    keys: ["VIS21-PRO-8KJD-MN34", "VIS21-PRO-3BVC-XZ56"]
  },
  {
    title: "Project Professional 2021 — Retail",
    slug: "microsoft-project-professional-2021",
    description: "Herramienta profesional para gestión de proyectos. Gantt, asignación de recursos, seguimiento de hitos y reportes automáticos. Licencia perpetua de un solo usuario.",
    price: 24.90,
    originalPrice: 699.00,
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=600&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80",
    platform: "Office",
    region: "GLOBAL",
    type: "Software",
    rating: 4.8,
    genre: "Office & Productivity",
    sellerName: "FastKeys Official",
    isFeatured: false,
    isHot: false,
    isRecent: false,
    isPopular: false,
    keys: ["PRJ21-PRO-5NML-QW78", "PRJ21-PRO-9HJK-SD90"]
  },

  // ─── SECURITY ───
  {
    title: "Kaspersky Premium — 10 Dispositivos / 1 Año",
    slug: "kaspersky-premium-10-devices-1-year",
    description: "Protección de primer nivel con VPN ilimitada, administrador de contraseñas, monitor de dark web y soporte técnico prioritario. Defensa multipremiada contra ransomware y phishing.",
    price: 34.95,
    originalPrice: 79.00,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=1200&auto=format&fit=crop&q=80",
    platform: "Security",
    region: "Europe",
    type: "Software",
    rating: 4.9,
    genre: "Antivirus & Security",
    sellerName: "KaspStore EU",
    isFeatured: true,
    isHot: true,
    isRecent: true,
    isPopular: true,
    isBestSeller: true,
    isOnSale: true,
    keys: ["KASP-PRM-10D1Y-EU01", "KASP-PRM-10D1Y-EU02", "KASP-PRM-10D1Y-EU03"]
  },
  {
    title: "ESET NOD32 Antivirus — 3 Dispositivos / 2 Años",
    slug: "eset-nod32-antivirus-3-devices-2-years",
    description: "Motor antivirus de bajo impacto con Modo Juego. Detecta amenazas零日 sin ralentizar tu PC. Ideal para gamers y entusiastas del rendimiento.",
    price: 45.80,
    originalPrice: 89.00,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
    platform: "Security",
    region: "Europe",
    type: "Software",
    rating: 4.8,
    genre: "Antivirus & Security",
    sellerName: "SecuKeys EU",
    isFeatured: true,
    isHot: false,
    isRecent: false,
    isPopular: true,
    isBestSeller: true,
    isOnSale: true,
    keys: ["ESET-NOD-3D2Y-EU01", "ESET-NOD-3D2Y-EU02"]
  },
  {
    title: "Bitdefender Total Security — 5 Dispositivos / 1 Año",
    slug: "bitdefender-total-security-5-devices-1-year",
    description: "Triple capa de protección: antivirus, firewall y anti-ransomware. Webcam protection, VPN de 200 MB/día y optimizador de rendimiento incluido.",
    price: 29.95,
    originalPrice: 59.00,
    image: "https://images.unsplash.com/photo-1601597111158-2fceff270190?w=600&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1563986768494-0d2b4b323b5f?w=1200&auto=format&fit=crop&q=80",
    platform: "Security",
    region: "Europe",
    type: "Software",
    rating: 4.7,
    genre: "Antivirus & Security",
    sellerName: "SecuKeys EU",
    isFeatured: false,
    isHot: true,
    isRecent: false,
    isPopular: true,
    isBestSeller: true,
    isOnSale: true,
    keys: ["BITD-TS5-1Y-EU01", "BITD-TS5-1Y-EU02"]
  },
  {
    title: "Norton 360 Deluxe — 5 Dispositivos / 1 Año",
    slug: "norton-360-deluxe-5-devices-1-year",
    description: "Protección integral con VPN, monitor de dark web, 50 GB de almacenamiento en la nube y antivirus con IA. Cobertura multiplataforma completa.",
    price: 19.95,
    originalPrice: 49.99,
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
    platform: "Security",
    region: "Global",
    type: "Software",
    rating: 4.6,
    genre: "Antivirus & Security",
    sellerName: "Norton Official",
    isFeatured: true,
    isHot: false,
    isRecent: false,
    isPopular: true,
    isBestSeller: true,
    isOnSale: true,
    keys: ["NRT360-DLX-5D1Y-GL01", "NRT360-DLX-5D1Y-GL02"]
  },

  // ─── SERVERS & DEV ───
  {
    title: "Windows Server 2025 Standard — Retail",
    slug: "microsoft-windows-server-2025-standard",
    description: "Infraestructura empresariales híbrida con Azure. Virtualización mejorada, almacenamiento definido por software y capas reforzadas de ciberseguridad.",
    price: 14.90,
    originalPrice: 999.00,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1600132806608-231446b2e7af?w=1200&auto=format&fit=crop&q=80",
    platform: "Windows Server",
    region: "GLOBAL",
    type: "Software",
    rating: 4.8,
    genre: "Dev & Servers",
    sellerName: "ServerKeys Corp",
    isFeatured: true,
    isHot: true,
    isRecent: true,
    isPopular: true,
    isBestSeller: true,
    isOnSale: true,
    keys: ["SRV25-STD-RTL1-KEYY", "SRV25-STD-RTL2-KEYY"]
  },
  {
    title: "Windows Server 2025 Datacenter — Retail",
    slug: "microsoft-windows-server-2025-datacenter",
    description: "Para centros de datos virtuales de alta densidad. Contenedores ilimitados, almacenamiento definido por software y escalamiento masivo con Azure Arc.",
    price: 14.90,
    originalPrice: 1099.00,
    image: "https://images.unsplash.com/photo-1597852074816-d933c4d2b988?w=600&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200&auto=format&fit=crop&q=80",
    platform: "Windows Server",
    region: "GLOBAL",
    type: "Software",
    rating: 4.9,
    genre: "Dev & Servers",
    sellerName: "ServerKeys Corp",
    isFeatured: false,
    isHot: false,
    isRecent: true,
    isPopular: false,
    keys: ["SRV25-DTC-RTL1-KEXX", "SRV25-DTC-RTL2-KEXX"]
  },
  {
    title: "SQL Server 2019 Standard — 2 Core",
    slug: "microsoft-windows-sql-server-2019-standard",
    description: "Motor de bases de datos empresariales con inteligencia integrada. Consultas rápidas, seguridad avanzada y compatibilidad con datos relacionales y no relacionales.",
    price: 89.00,
    originalPrice: 1499.00,
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&auto=format&fit=crop&q=80",
    platform: "SQL Server",
    region: "GLOBAL",
    type: "Software",
    rating: 4.8,
    genre: "Dev & Servers",
    sellerName: "Enterprise Keys",
    isFeatured: true,
    isHot: false,
    isRecent: false,
    isPopular: true,
    isBestSeller: true,
    isOnSale: true,
    keys: ["SQL19-STD-2C-KEY1", "SQL19-STD-2C-KEY2"]
  },
  {
    title: "Visual Studio 2022 Professional — Retail",
    slug: "microsoft-visual-studio-2022-professional",
    description: "IDE completo para desarrollo profesional con IA integrada (GitHub Copilot), depuración avanzada y soporte para .NET, C#, Python, JavaScript y más.",
    price: 19.90,
    originalPrice: 449.00,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&auto=format&fit=crop&q=80",
    platform: "Windows",
    region: "GLOBAL",
    type: "Software",
    rating: 4.9,
    genre: "Dev & Servers",
    sellerName: "FastKeys Official",
    isFeatured: true,
    isHot: true,
    isRecent: true,
    isPopular: true,
    isBestSeller: true,
    isOnSale: true,
    keys: ["VS22-PRO-RTL1-AAAA", "VS22-PRO-RTL2-BBBB", "VS22-PRO-RTL3-CCCC"]
  },
  {
    title: "Office Home & Business 2024 — Mac",
    slug: "microsoft-office-home-business-2024-mac",
    description: "Versión perpetua optimizada para macOS. Word, Excel, PowerPoint y Outlook. Sin suscripción, activación con tu Apple ID, soporte por un año incluido.",
    price: 39.90,
    originalPrice: 249.00,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80",
    platform: "Office",
    region: "GLOBAL",
    type: "Software",
    rating: 4.7,
    genre: "Office & Productivity",
    sellerName: "Apple Keys Store",
    isFeatured: true,
    isHot: false,
    isRecent: true,
    isPopular: true,
    isBestSeller: true,
    isOnSale: true,
    keys: ["OP24-MAC-HB1-KEY1", "OP24-MAC-HB1-KEY2"]
  }
];

async function main() {
  console.log("Starting seeding with PixelCodes Premium Software Catalog...");

  // Clean the DB first
  await prisma.pointTransaction.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.key.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.badge.deleteMany({});
  await prisma.platform.deleteMany({});

  // Seed Platforms
  const platformData = [
    { name: "Windows", icon: "Monitor", color: "text-gray-400", bgColor: "bg-white/[0.04]" },
    { name: "Office", icon: "HardDrive", color: "text-gray-400", bgColor: "bg-white/[0.04]" },
    { name: "Security", icon: "ShieldCheck", color: "text-gray-400", bgColor: "bg-white/[0.04]" },
    { name: "Server", icon: "Server", color: "text-gray-400", bgColor: "bg-white/[0.04]" },
    { name: "Steam", icon: "Gamepad2", color: "text-gray-400", bgColor: "bg-white/[0.04]" },
    { name: "Other", icon: "Key", color: "text-gray-400", bgColor: "bg-white/[0.04]" },
  ];

  const platformsCreated = {};
  for (const p of platformData) {
    const platform = await prisma.platform.create({ data: p });
    platformsCreated[p.name] = platform.id;
    console.log(`  Platform created: ${p.name}`);
  }

  // Seed Badges
  const badgeData = [
    { name: "Best Value", icon: "Trophy", color: "text-gray-400", bgColor: "bg-white/[0.04]", borderColor: "border-white/[0.08]" },
    { name: "Official", icon: "ShieldCheck", color: "text-gray-400", bgColor: "bg-white/[0.04]", borderColor: "border-white/[0.08]" },
    { name: "Instant", icon: "Zap", color: "text-gray-400", bgColor: "bg-white/[0.04]", borderColor: "border-white/[0.08]" },
    { name: "Premium", icon: "Star", color: "text-gray-400", bgColor: "bg-white/[0.04]", borderColor: "border-white/[0.08]" },
    { name: "Limited", icon: "Clock", color: "text-gray-400", bgColor: "bg-white/[0.04]", borderColor: "border-white/[0.08]" },
  ];

  const badgesCreated = {};
  for (const b of badgeData) {
    const badge = await prisma.badge.create({ data: b });
    badgesCreated[b.name] = badge.id;
    console.log(`  Badge created: ${b.name}`);
  }

  console.log("Database cleared. Inserting premium software products and keys...");

  for (const item of softwareProducts) {
    const { keys, platformSlug, badgeSlugs, ...productData } = item;

    const platformId = platformSlug && platformsCreated[item.platform] ? platformsCreated[item.platform] : null;

    const badgeIds = (badgeSlugs || []).map(slug => {
      const badgeName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return badgesCreated[badgeName] || badgesCreated[Object.keys(badgesCreated).find(k => k.toLowerCase() === slug.toLowerCase())];
    }).filter(Boolean);

    const product = await prisma.product.create({
      data: {
        ...productData,
        platformId,
        badges: badgeIds.length > 0 ? { connect: badgeIds.map(id => ({ id })) } : undefined,
      },
    });
    console.log(`  Created: ${product.title}`);

    for (const keyCode of keys) {
      await prisma.key.create({ data: { code: keyCode, productId: product.id } });
    }
    console.log(`  Added ${keys.length} keys`);
  }

  // Seed default admin account
  const existingAdmin = await prisma.admin.findUnique({ where: { username: 'admin' } });
  if (!existingAdmin) {
    const { hash, salt } = hashPassword('admin2026');
    await prisma.admin.create({
      data: { username: 'admin', passwordHash: hash, salt },
    });
    console.log('Default admin created: admin / admin2026');
  } else {
    console.log('Admin account already exists.');
  }

  console.log("PixelCodes Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

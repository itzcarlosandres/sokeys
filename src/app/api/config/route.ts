import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    let config = await db.siteConfig.findUnique({ where: { id: 'default' } });
    if (!config) {
      config = await db.siteConfig.create({
        data: {
          id: 'default',
          homeColumns: 4,
          homeFeaturedCount: 8,
          catalogColumns: 4,
          pointsPerDollar: 10,
          siteName: 'PixelCodes',
          siteDescription: 'La tienda premium de activación de licencias digitales.',
          currencyCode: 'USD',
          currencySymbol: '$',
        },
      });
    }
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      siteName, siteDescription, siteKeywords, ogImageUrl, siteUrl,
      currencyCode, currencySymbol, supportEmail, logoUrl,
      cashbackEnabled, cashbackPercent,
      pointsPerDollar, homeColumns, homeFeaturedCount, catalogColumns,
    } = body;

    const config = await db.siteConfig.upsert({
      where: { id: 'default' },
      update: {
        siteName: siteName || 'PixelCodes',
        siteDescription: siteDescription || '',
        siteKeywords: siteKeywords || null,
        ogImageUrl: ogImageUrl || null,
        siteUrl: siteUrl || null,
        currencyCode: currencyCode || 'USD',
        currencySymbol: currencySymbol || '$',
        supportEmail: supportEmail || null,
        logoUrl: logoUrl || null,
        cashbackEnabled: cashbackEnabled || false,
        cashbackPercent: Number(cashbackPercent) || 0,
        pointsPerDollar: Number(pointsPerDollar) || 10,
        homeColumns: Number(homeColumns) || 4,
        homeFeaturedCount: Number(homeFeaturedCount) || 8,
        catalogColumns: Number(catalogColumns) || 4,
      },
      create: {
        id: 'default',
        siteName: siteName || 'PixelCodes',
        siteDescription: siteDescription || '',
        siteKeywords: siteKeywords || null,
        ogImageUrl: ogImageUrl || null,
        siteUrl: siteUrl || null,
        currencyCode: currencyCode || 'USD',
        currencySymbol: currencySymbol || '$',
        supportEmail: supportEmail || null,
        logoUrl: logoUrl || null,
        cashbackEnabled: cashbackEnabled || false,
        cashbackPercent: Number(cashbackPercent) || 0,
        pointsPerDollar: Number(pointsPerDollar) || 10,
        homeColumns: Number(homeColumns) || 4,
        homeFeaturedCount: Number(homeFeaturedCount) || 8,
        catalogColumns: Number(catalogColumns) || 4,
      },
    });

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

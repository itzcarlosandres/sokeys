import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    let config = await db.siteConfig.findUnique({ where: { id: 'default' } });
    if (!config) {
      config = await db.siteConfig.create({
        data: { id: 'default', homeColumns: 4, homeFeaturedCount: 8, catalogColumns: 4, pointsPerDollar: 10 },
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
    const { homeColumns, homeFeaturedCount, catalogColumns, pointsPerDollar } = body;

    const config = await db.siteConfig.upsert({
      where: { id: 'default' },
      update: {
        homeColumns: Number(homeColumns) || 4,
        homeFeaturedCount: Number(homeFeaturedCount) || 8,
        catalogColumns: Number(catalogColumns) || 4,
        pointsPerDollar: Number(pointsPerDollar) || 10,
      },
      create: {
        id: 'default',
        homeColumns: Number(homeColumns) || 4,
        homeFeaturedCount: Number(homeFeaturedCount) || 8,
        catalogColumns: Number(catalogColumns) || 4,
        pointsPerDollar: Number(pointsPerDollar) || 10,
      },
    });

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

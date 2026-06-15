import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    const userId = req.nextUrl.searchParams.get('userId');

    let orders;

    if (userId) {
      orders = await db.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: { select: { title: true, slug: true } },
              keys: { select: { code: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else if (email) {
      orders = await db.order.findMany({
        where: { customerEmail: email },
        include: {
          items: {
            include: {
              product: { select: { title: true, slug: true } },
              keys: { select: { code: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      return NextResponse.json({ success: false, error: 'Se requiere email o userId.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      orders: orders.map(o => ({
        ...o,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
        items: o.items.map(item => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
        })),
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

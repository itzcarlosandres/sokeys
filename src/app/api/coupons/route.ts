import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const coupons = await db.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, discountType, discountValue, minPoints, expiresAt } = body;
    if (!code || !discountType || !discountValue || !minPoints) {
      return NextResponse.json({ success: false, error: 'Todos los campos son requeridos.' }, { status: 400 });
    }
    const existing = await db.coupon.findUnique({ where: { code } });
    if (existing) return NextResponse.json({ success: false, error: 'El código ya existe.' }, { status: 400 });
    const coupon = await db.coupon.create({
      data: {
        code,
        discountType,
        discountValue: Number(discountValue),
        minPoints: Number(minPoints),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID requerido.' }, { status: 400 });
    await db.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
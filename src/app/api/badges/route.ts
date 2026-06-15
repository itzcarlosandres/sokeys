import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const badges = await db.badge.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json({ success: true, badges });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, icon, color, bgColor, borderColor } = body;
    if (!name) return NextResponse.json({ success: false, error: 'Nombre requerido.' }, { status: 400 });
    const existing = await db.badge.findUnique({ where: { name } });
    if (existing) return NextResponse.json({ success: false, error: 'El badge ya existe.' }, { status: 400 });
    const badge = await db.badge.create({
      data: { name, icon: icon || 'Star', color: color || 'text-amber-400', bgColor: bgColor || 'bg-amber-500/10', borderColor: borderColor || 'border-amber-500/20' },
    });
    return NextResponse.json({ success: true, badge });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, icon, color, bgColor, borderColor } = body;
    if (!id) return NextResponse.json({ success: false, error: 'ID requerido.' }, { status: 400 });
    const badge = await db.badge.update({ where: { id }, data: { name, icon, color, bgColor, borderColor } });
    return NextResponse.json({ success: true, badge });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID requerido.' }, { status: 400 });
    await db.badge.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
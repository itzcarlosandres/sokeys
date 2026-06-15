import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const platforms = await db.platform.findMany({ orderBy: { name: 'asc' } });
    return NextResponse.json({ success: true, platforms });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, icon, color, bgColor } = body;
    if (!name) return NextResponse.json({ success: false, error: 'Nombre requerido.' }, { status: 400 });
    const existing = await db.platform.findUnique({ where: { name } });
    if (existing) return NextResponse.json({ success: false, error: 'La plataforma ya existe.' }, { status: 400 });
    const platform = await db.platform.create({ data: { name, icon: icon || 'Monitor', color: color || 'text-blue-400', bgColor: bgColor || 'bg-blue-500/10' } });
    return NextResponse.json({ success: true, platform });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, icon, color, bgColor } = body;
    if (!id) return NextResponse.json({ success: false, error: 'ID requerido.' }, { status: 400 });
    const platform = await db.platform.update({ where: { id }, data: { name, icon, color, bgColor } });
    return NextResponse.json({ success: true, platform });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID requerido.' }, { status: 400 });
    await db.platform.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
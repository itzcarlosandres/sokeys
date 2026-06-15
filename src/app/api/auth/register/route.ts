import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Todos los campos son obligatorios.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'La contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Ya existe una cuenta con ese email.' }, { status: 400 });
    }

    const { hash, salt } = hashPassword(password);
    const user = await db.user.create({
      data: { name, email, passwordHash: hash, salt },
    });

    const token = generateToken();
    await db.session.create({
      data: { token, userId: user.id, userType: 'user' },
    });

    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

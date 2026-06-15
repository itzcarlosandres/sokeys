import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email y contraseña obligatorios.' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: false, error: 'Credenciales inválidas.' }, { status: 401 });
    }

    if (!verifyPassword(password, user.passwordHash, user.salt)) {
      return NextResponse.json({ success: false, error: 'Credenciales inválidas.' }, { status: 401 });
    }

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

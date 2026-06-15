import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'No autorizado.' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const session = await db.session.findUnique({
      where: { token },
    });

    if (!session || session.userType !== 'user') {
      return NextResponse.json({ success: false, error: 'Sesión inválida.' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, points: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Usuario no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

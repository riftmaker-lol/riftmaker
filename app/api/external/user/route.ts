import { userDto } from '@/components/dtos/user';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get session token from authorization header
  const bearerHeader = request.headers.get('Authorization');
  if (!bearerHeader) {
    return NextResponse.json({ message: 'Missing authorization header' }, { status: 400 });
  }

  const bearer = bearerHeader.split(' ');
  if (bearer.length !== 2) {
    return NextResponse.json({ message: 'Invalid authorization header' }, { status: 400 });
  }

  const token = bearer[1];

  // Get user from token
  const user = await prisma.session.findFirstOrThrow({
    where: {
      sessionToken: token,
    },
    include: {
      user: true,
    },
  });

  return NextResponse.json({
    user: userDto(user.user),
  });
}

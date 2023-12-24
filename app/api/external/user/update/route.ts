import { userDto } from '@/components/dtos/user';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    { message: 'ok' },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    },
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { accountId } = body;

  if (!accountId) {
    return NextResponse.json({ message: 'Missing accountId' }, { status: 400 });
  }

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

  // Update user accountId
  const updateUser = await prisma.user.update({
    where: {
      id: user.user.id,
    },
    data: {
      accountId,
    },
  });

  return NextResponse.json({
    user: userDto(updateUser),
  });
}

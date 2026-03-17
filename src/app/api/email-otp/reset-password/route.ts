import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();

    const response = await fetch(`${req.nextUrl.origin}/api/auth/email-otp/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Failed to reset password with OTP:', error);
    return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 });
  }
}

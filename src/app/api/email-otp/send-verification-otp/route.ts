import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = await req.json();
        const baseUrl = process.env.BASE_URL ?? req.nextUrl.origin;
        const origin = req.headers.get('origin');
        const cookie = req.headers.get('cookie');

        const response = await fetch(`${baseUrl}/api/auth/email-otp/send-verification-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(origin ? { origin } : {}),
                ...(cookie ? { cookie } : {}),
            },
            body: JSON.stringify(body),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            console.error('Better Auth OTP upstream error:', data);
        }

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Failed to request verification OTP:', error);
        return NextResponse.json({ error: 'Failed to request OTP.' }, { status: 500 });
    }
}

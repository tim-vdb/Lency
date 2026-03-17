// lib/auth.ts

import { prisma } from '@/back/lib/prisma';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { emailOTP } from 'better-auth/plugins';
import { sendAuthOtpEmail } from './send-auth-otp-email';

const otpExpiresIn = Number(process.env.AUTH_EMAIL_OTP_EXPIRES_IN ?? 300);

export const auth = betterAuth({
  baseURL: process.env.BASE_URL,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: 'select_account',
    },
  },
  trustedOrigins: [
    process.env.BASE_URL ?? 'http://localhost:3000',
  ],
  plugins: [
    nextCookies(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      sendVerificationOnSignUp: false,
      otpLength: 6,
      expiresIn: Number.isFinite(otpExpiresIn) ? otpExpiresIn : 300,
      allowedAttempts: 3,
      async sendVerificationOTP({ email, otp, type }) {
        await sendAuthOtpEmail({ email, otp, type });
      },
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'MEMBER',
      },
    },
  },
});

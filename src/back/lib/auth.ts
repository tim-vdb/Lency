// lib/auth.ts

import { UsersAction } from '@/back/repositories/users.action';
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
      mapProfileToUser: (profile) => ({
        firstname: profile.given_name ?? null,
        lastname: profile.family_name ?? null,
      }),
    },
  },
  trustedOrigins: [
    process.env.BASE_URL ?? 'http://localhost:3000',
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (!user.username && user.firstname) {
            const username = await UsersAction.generateUniqueUsername(user.firstname as string);
            await UsersAction.update(user.id, { username });
          }
        },
      },
    },
  },
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
        input: false,
      },
      firstname: {
        type: 'string',
        required: false,
      },
      lastname: {
        type: 'string',
        required: false,
      },
    },
  },
});

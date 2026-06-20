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
          const updates: Record<string, any> = {};

          // Générer username s'il n'existe pas
          if (!user.username) {
            const firstName = (user.firstname as string | null) ?? (user.name as string | null)?.split(' ')[0];
            if (firstName) {
              const username = await UsersAction.generateUniqueUsername(firstName);
              updates.username = username;
            }
          }

          // Définir comme admin si c'est cet email
          if (user.email === 'timotheevdbosch@gmail.com') {
            updates.role = 'ADMIN';
          }

          // Appliquer les mises à jour s'il y en a
          if (Object.keys(updates).length > 0) {
            await UsersAction.update(user.id, updates);
          }
        },
      },
    },
  },
  plugins: [
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
    nextCookies(),
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

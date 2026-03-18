This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Better Auth Email OTP

The project now uses Better Auth email OTP for:

- Email verification
- Password reset (forgot password flow)

### Required environment variables

Add these variables to your environment configuration:

```bash
BASE_URL=http://localhost:3000
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_AUTH_EMAIL="Lency <auth@infos.lency.net>"
AUTH_EMAIL_OTP_EXPIRES_IN=300
```

### OTP options used

Configured in `src/back/lib/auth.ts`:

- `overrideDefaultEmailVerification: true`
- `sendVerificationOnSignUp: true`
- `otpLength: 6`
- `expiresIn: AUTH_EMAIL_OTP_EXPIRES_IN` (seconds)
- `allowedAttempts: 3`

### New auth pages

- `/verify-email`: verify user email with OTP
- `/forgot-password`: request password reset OTP
- `/reset-password`: submit OTP + new password

### Email templates

- `src/front/emails/VerifyEmailOTP.tsx`
- `src/front/emails/ResetPasswordOTP.tsx`

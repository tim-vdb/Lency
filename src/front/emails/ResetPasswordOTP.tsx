import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from '@react-email/components';

interface ResetPasswordOTPProps {
  firstName?: string | null;
  otp: string;
  expiresInMinutes?: number;
}

export default function ResetPasswordOTP({
  firstName,
  otp,
  expiresInMinutes = 5,
}: ResetPasswordOTPProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Lency password reset code</Preview>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                panel: '#fff7ed',
                border: '#fed7aa',
                brand: '#ea580c',
              },
            },
          },
        }}
      >
        <Body className="bg-panel py-6 font-sans">
          <Container className="mx-auto max-w-[560px] rounded-xl border border-border bg-white p-8">
            <Heading className="m-0 mb-4 text-2xl text-neutral-900">Reset your password</Heading>
            <Text className="text-base text-neutral-700">
              {firstName ? `Hi ${firstName},` : 'Hi,'} use this OTP code to reset your password.
            </Text>

            <Section className="my-6 rounded-lg border border-dashed border-brand bg-orange-50 px-4 py-5 text-center">
              <Text className="m-0 text-[34px] font-bold tracking-[0.28em] text-brand">{otp}</Text>
            </Section>

            <Text className="text-sm text-neutral-600">
              This code expires in {expiresInMinutes} minutes. If you did not request a password reset, please secure your account.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

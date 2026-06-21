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

interface VerifyEmailOTPProps {
    firstName?: string | null;
    otp: string;
    expiresInMinutes?: number;
}

export default function VerifyEmailOTP({
    firstName,
    otp,
    expiresInMinutes = 5,
}: VerifyEmailOTPProps) {
    return (
        <Html>
            <Head />
            <Preview>Your Lency email verification code</Preview>
            <Tailwind
                config={{
                    presets: [pixelBasedPreset],
                    theme: {
                        extend: {
                            colors: {
                                panel: '#f8fafc',
                                border: '#e2e8f0',
                                brand: '#2250f4',
                            },
                        },
                    },
                }}
            >
                <Body className="bg-panel py-6 font-sans">
                    <Container className="mx-auto max-w-[560px] rounded-xl border border-border bg-white p-8">
                        <Heading className="m-0 mb-4 text-2xl text-neutral-900">Verify your email</Heading>
                        <Text className="text-base text-neutral-700">
                            {firstName ? `Hi ${firstName},` : 'Hi,'} use the code below to verify your email address.
                        </Text>

                        <Section className="my-6 rounded-lg border border-dashed border-brand bg-blue-50 px-4 py-5 text-center">
                            <Text className="m-0 text-[34px] font-bold tracking-[0.28em] text-brand">{otp}</Text>
                        </Section>

                        <Text className="text-sm text-neutral-600">
                            This code expires in {expiresInMinutes} minutes. If you did not request this code, you can ignore this email.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}

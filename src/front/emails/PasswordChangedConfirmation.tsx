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

interface PasswordChangedConfirmationProps {
  firstName?: string | null;
}

export default function PasswordChangedConfirmation({
  firstName,
}: PasswordChangedConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Votre mot de passe Lency a été modifié</Preview>
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
            <Heading className="m-0 mb-4 text-2xl text-neutral-900">
              Mot de passe modifié
            </Heading>
            <Text className="text-base text-neutral-700">
              {firstName ? `Bonjour ${firstName},` : 'Bonjour,'} votre mot de passe a bien été modifié.
            </Text>

            <Section className="my-6 rounded-lg border border-dashed border-brand bg-orange-50 px-4 py-5">
              <Text className="m-0 text-sm text-neutral-700">
                Si vous n'êtes pas à l'origine de cette modification, veuillez sécuriser votre compte immédiatement en réinitialisant votre mot de passe.
              </Text>
            </Section>

            <Text className="text-sm text-neutral-600">
              Cette modification a été effectuée depuis les paramètres de sécurité de votre compte Lency.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

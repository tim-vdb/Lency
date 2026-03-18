import {
    Body,
    Button,
    Column,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    pixelBasedPreset,
    Row,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
import type * as React from 'react';

interface LencyWelcomeEmailProps {
    firstName?: string | null;
    steps?: {
        id: number;
        Description: React.ReactNode;
    }[];
    links?: {
        title: string;
        href: string;
    }[];
}

const baseUrl = process.env.BASE_URL;

const defaultSteps: LencyWelcomeEmailProps['steps'] = [
    {
        id: 1,
        Description: 'Creez votre profil et completez vos informations.',
    },
    {
        id: 2,
        Description: 'Publiez votre premier projet audiovisuel.',
    },
    {
        id: 3,
        Description: "Rejoignez la communaute et collaborez avec d'autres membres.",
    },
];

const defaultLinks: LencyWelcomeEmailProps['links'] = [
    { title: 'Visiter la communaute', href: `${baseUrl}/community` },
    { title: 'Explorer les projets', href: `${baseUrl}/projects` },
    { title: 'Contacter l equipe', href: `${baseUrl}/contact` },
];

export const WelcomeEmail = ({
    firstName,
    steps,
    links,
}: LencyWelcomeEmailProps) => {
    const emailSteps = steps && steps.length > 0 ? steps : defaultSteps;
    const emailLinks = links && links.length > 0 ? links : defaultLinks;

    return (
        <Html>
            <Head />
            <Preview>Lency - Bienvenue</Preview>
            <Tailwind
                config={{
                    presets: [pixelBasedPreset],
                    theme: {
                        extend: {
                            colors: {
                                brand: '#2250f4',
                                offwhite: '#fafbfb',
                            },
                            spacing: {
                                0: '0px',
                                20: '20px',
                                45: '45px',
                            },
                        },
                    },
                }}
            >
                <Body className="bg-offwhite font-sans text-base">
                    <Container className="mx-auto max-w-[640px] text-center py-6 px-3">
                        <Img
                            src={`${baseUrl}/images/cassetete.jpg`}
                            width="184"
                            height="75"
                            alt="Lency"
                            className="mx-auto mb-6"
                        />

                        <Container className="bg-white rounded-xl border border-gray-200 p-8">
                            <Heading className="my-0 mb-5 text-center text-4xl leading-tight text-gray-900">
                                Bienvenue sur Lency
                            </Heading>

                            <Text className="text-lg leading-7 text-gray-900 text-left mb-3">
                                Felicitations {firstName ? `${firstName} !` : '!'} Vous venez de rejoindre Lency, la plateforme d'audiovisuel pour creer votre projet.
                            </Text>

                            <Text className="text-lg leading-7 text-gray-900 text-left mb-4">
                                Retrouvez ci-dessous les options pour debuter :
                            </Text>

                            <Section className="text-left mb-5">
                                <ul className="m-0 pl-5 text-base leading-7 text-gray-900">
                                    {emailSteps?.map(({ id, Description }) => (
                                        <li key={id} className="mb-3">{Description}</li>
                                    ))}
                                </ul>
                            </Section>

                            <Section className="text-center my-6">
                                <Button
                                    href={`${baseUrl}/account`}
                                    className="rounded-lg bg-brand px-[18px] py-3 text-white text-base"
                                >
                                    Acceder au tableau de bord
                                </Button>
                            </Section>

                            <Section className="mt-6">
                                <Row>
                                    {emailLinks?.map((link) => (
                                        <Column key={link.title} className="px-1.5">
                                            <Link className="font-bold text-black underline text-sm" href={link.href}>
                                                {link.title}
                                            </Link>
                                        </Column>
                                    ))}
                                </Row>
                            </Section>
                        </Container>

                        <Container className="mt-5 pb-4">
                            <Section>
                                <Row>
                                    <Column className="px-2 text-right">
                                        <Link href={`${baseUrl}/account/profile`} className="text-brand text-base">Voir mon profil</Link>
                                    </Column>
                                    <Column className="px-2 text-left">
                                        <Link href={`${baseUrl}/account/preferences`} className="text-brand text-base">Manage Preferences</Link>
                                    </Column>
                                </Row>
                            </Section>
                            <Text className="mt-[18px] mb-0 text-center text-gray-400 text-sm">
                                Lency, 44 Montgomery Street, Suite 300 San Francisco, CA
                            </Text>
                        </Container>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

WelcomeEmail.PreviewProps = {
    firstName: 'Membre',
    steps: [
        {
            id: 1,
            Description: 'Creez votre profil et completez vos informations.',
        },
        {
            id: 2,
            Description: 'Publiez votre premier projet audiovisuel.',
        },
        {
            id: 3,
            Description: "Rejoignez la communaute et collaborez avec d'autres membres.",
        },
    ],
    links: [
        { title: 'Visiter la communaute', href: `${baseUrl}/community` },
        { title: 'Explorer les projets', href: `${baseUrl}/projects` },
        { title: 'Contacter l equipe', href: `${baseUrl}/contact` },
    ],
} satisfies LencyWelcomeEmailProps;

export default WelcomeEmail;

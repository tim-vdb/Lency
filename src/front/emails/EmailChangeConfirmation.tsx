import { Html, Head, Body, Container, Section, Text, Link } from '@react-email/components'

export default function EmailChangeConfirmation({
    firstName,
    confirmationUrl,
}: {
    firstName?: string | null
    confirmationUrl: string
}) {
    return (
        <Html>
            <Head />
            <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5' }}>
                <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
                    <Section style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px' }}>
                        <Text style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 20px 0', color: '#1a1a1a' }}>
                            Confirmez votre nouvelle adresse email
                        </Text>

                        <Text style={{ fontSize: '16px', lineHeight: '1.6', color: '#333333', marginBottom: '20px' }}>
                            Bonjour {firstName ?? 'Utilisateur'},
                        </Text>

                        <Text style={{ fontSize: '16px', lineHeight: '1.6', color: '#333333', marginBottom: '20px' }}>
                            Vous avez demandé à changer l'adresse email associée à votre compte Lency. Cliquez sur le bouton ci-dessous pour confirmer cette nouvelle adresse.
                        </Text>

                        <Section style={{ marginBottom: '30px', textAlign: 'center' }}>
                            <Link
                                href={confirmationUrl}
                                style={{
                                    display: 'inline-block',
                                    padding: '12px 32px',
                                    backgroundColor: '#ff6b35',
                                    color: '#ffffff',
                                    textDecoration: 'none',
                                    borderRadius: '6px',
                                    fontWeight: 'bold',
                                }}
                            >
                                Confirmer mon email
                            </Link>
                        </Section>

                        <Text style={{ fontSize: '14px', color: '#666666', marginBottom: '15px' }}>
                            Ou copiez ce lien dans votre navigateur :
                        </Text>
                        <Text
                            style={{
                                fontSize: '12px',
                                color: '#0066cc',
                                wordBreak: 'break-all',
                                marginBottom: '20px',
                                backgroundColor: '#f0f0f0',
                                padding: '10px',
                                borderRadius: '4px',
                            }}
                        >
                            {confirmationUrl}
                        </Text>

                        <Text style={{ fontSize: '14px', color: '#666666', marginBottom: '15px' }}>
                            Ce lien expire dans 24 heures.
                        </Text>

                        <Text style={{ fontSize: '14px', color: '#666666', marginBottom: '20px' }}>
                            Si vous n'avez pas demandé ce changement, ignorez cet email. Votre adresse email actuelle reste inchangée.
                        </Text>

                        <Text
                            style={{
                                fontSize: '12px',
                                color: '#999999',
                                marginTop: '30px',
                                paddingTop: '20px',
                                borderTop: '1px solid #dddddd',
                            }}
                        >
                            © 2026 Lency. Tous droits réservés.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    )
}

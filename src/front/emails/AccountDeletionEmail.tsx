import { Button, Container, Head, Html, Link, Preview, Row, Section, Text } from "@react-email/components";

interface AccountDeletionEmailProps {
  firstname: string | null;
  confirmationLink: string;
  expiresIn: string;
}

export function AccountDeletionEmail({
  firstname,
  confirmationLink,
  expiresIn,
}: AccountDeletionEmailProps) {
  const displayName = firstname || "utilisateur";

  return (
    <Html>
      <Head />
      <Preview>Confirmation de suppression de compte</Preview>
      <Container style={container}>
        <Section style={box}>
          <Text style={heading}>Confirmation de suppression de compte</Text>

          <Text style={text}>
            Bonjour {displayName},
          </Text>

          <Text style={text}>
            Nous avons reçu une demande de suppression de votre compte Lency. Cette action est <strong>permanente et irréversible</strong>.
          </Text>

          <Text style={alertBox}>
            ⚠️ Toutes vos données associées (posts, projets, messages, etc.) seront définitivement supprimées.
          </Text>

          <Row style={{ marginTop: "24px", marginBottom: "24px" }}>
            <Button style={button} href={confirmationLink}>
              Confirmer la suppression du compte
            </Button>
          </Row>

          <Text style={smallText}>
            Ou copiez ce lien dans votre navigateur :<br />
            <Link href={confirmationLink} style={link}>
              {confirmationLink}
            </Link>
          </Text>

          <Text style={footerText}>
            Ce lien expire dans {expiresIn}.
          </Text>

          <Text style={footerText}>
            Si vous n'avez pas demandé la suppression de votre compte, ignorez cet email ou contactez notre équipe support à <strong>support@infos.lency.net</strong>.
          </Text>

          <Text style={signature}>
            L'équipe Lency
          </Text>
        </Section>
      </Container>
    </Html>
  );
}

const container = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif',
  margin: "0 auto",
  padding: "20px 0 48px",
};

const box = {
  border: "1px solid #f0f0f0",
  borderRadius: "8px",
  margin: "40px auto",
  padding: "40px",
  maxWidth: "600px",
};

const heading = {
  color: "#dc2626",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 24px 0",
};

const text = {
  color: "#1f2937",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const alertBox = {
  backgroundColor: "#fee2e2",
  border: "1px solid #fecaca",
  borderRadius: "6px",
  color: "#991b1b",
  padding: "12px 16px",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "16px 0",
};

const button = {
  backgroundColor: "#dc2626",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px 32px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
};

const link = {
  color: "#0ea5e9",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
};

const smallText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "16px 0",
};

const footerText = {
  color: "#9ca3af",
  fontSize: "13px",
  lineHeight: "18px",
  margin: "12px 0",
};

const signature = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "24px 0 0 0",
  fontStyle: "italic",
};

export default AccountDeletionEmail;

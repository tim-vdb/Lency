import { Resend } from "resend";
import { AccountDeletionEmail } from "@/front/emails/AccountDeletionEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAccountDeletionEmail({
  email,
  firstname,
  confirmationToken,
}: {
  email: string;
  firstname: string | null;
  confirmationToken: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.error("[send-account-deletion-email] RESEND_API_KEY is not defined");
    throw new Error("Email service not configured");
  }

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const confirmationLink = `${baseUrl}/api/account/confirm-deletion/${confirmationToken}`;
  const expiresIn = "24 heures";

  try {
    console.warn("[send-account-deletion-email] Sending email to:", email);
    await resend.emails.send({
      from: "support@infos.lency.net",
      to: email,
      subject: "Confirmation de suppression de compte — Lency",
      react: AccountDeletionEmail({
        firstname,
        confirmationLink,
        expiresIn,
      }),
    });
    console.warn("[send-account-deletion-email] Email sent successfully");
  } catch (error) {
    console.error("[send-account-deletion-email] Error:", error);
    throw error;
  }
}

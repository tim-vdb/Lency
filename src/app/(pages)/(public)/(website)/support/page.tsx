import type { Metadata } from 'next';
import ContactForm from "./_components/ContactForm";

export const metadata: Metadata = {
    title: 'Support — Lency',
    description: 'Besoin d\'aide ? Contactez le support Lency et obtenez une réponse rapide.',
};

export default function SupportPage() {
  return (
    <div>
      <ContactForm />
    </div>
  )
}

import type { Metadata } from 'next';
import TeamSection from "@/front/components/Public/Team/team";

export const metadata: Metadata = {
    title: 'Équipe — Lency',
    description: 'Découvrez l\'équipe qui a créé et développe Lency, la communauté des créatifs audiovisuels.',
};

export default function Team() {
  return (
    <div>
      <TeamSection />
    </div>
  );
}

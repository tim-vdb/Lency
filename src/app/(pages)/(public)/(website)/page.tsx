import type { Metadata } from 'next';
import HeroSection from '@/front/components/Public/HomePage/hero-section';

export const metadata: Metadata = {
    title: 'Lency — La communauté des créatifs audiovisuels',
    description: 'Lency réunit les créatifs audiovisuels : trouvez des projets, partagez vos créations et collaborez avec des talents du monde entier.',
};

export default async function Home() {
  return (
    <div>
      <HeroSection />
    </div>
  );
}

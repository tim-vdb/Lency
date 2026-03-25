'use client';

import { useUser } from '@/front/context/UserContext';
import { ProfileCard } from '@/front/components/Private/Profile/ProfileCard';

export default function ProfilePage() {
  const user = useUser();

  return (
    <div className="py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Mon Profil</h1>
        <p className="text-gray-600">Gérez vos informations de profil et vos paramètres de compte</p>
      </div>

      <ProfileCard user={user} />
    </div>
  );
}
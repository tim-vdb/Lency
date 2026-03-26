'use client';

import { useUser } from '@/front/context/UserContext';
import { ProfileSection } from '@/front/components/Private/Account/Profile/ProfileSection';
import ProfileDelete from '@/front/components/Private/Account/Profile/ProfileDelete';

export default function ProfilePage() {
  const user = useUser();

  return (
    <div className="flex flex-col gap-2">
      <ProfileSection />
      <ProfileDelete />
    </div>
  );
}
'use client';

import { ProfileSection } from '@/front/components/Private/Account/Profile/ProfileSection';
import ProfileDelete from '@/front/components/Private/Account/Profile/ProfileDelete';

export default function ProfilePage() {

  return (
    <div className="flex flex-col gap-6">
      <ProfileSection />
      <ProfileDelete />
    </div>
  );
}
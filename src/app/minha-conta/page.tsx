'use client';

import { AccountHeader } from '@/components/account/account-header';
import { ProfileCard } from '@/components/account/profile-card';
import { AddressesCard } from '@/components/account/addresses-card';
import { FavoritesCard } from '@/components/account/favorites-card';
import { OrdersCard } from '@/components/account/orders-card';

export default function UserAccountPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <AccountHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ProfileCard />
          <OrdersCard />
        </div>
        
        <div className="space-y-6">
          <AddressesCard />
          <FavoritesCard />
        </div>
      </div>
    </div>
  );
}
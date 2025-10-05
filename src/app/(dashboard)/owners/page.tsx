import { OwnersList } from '@/features/owners/components/OwnersList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Owners | Real Estate Management',
  description: 'Manage property owners',
};

export default function OwnersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Owners</h1>
          <p className="text-muted-foreground">
            Manage property owners and their contact information
          </p>
        </div>
      </div>
      <OwnersList />
    </div>
  );
}

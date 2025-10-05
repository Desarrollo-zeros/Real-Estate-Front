import { TracesList } from '@/features/traces/components/TracesList';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Property Traces | Real Estate Management',
  description: 'Track property sales history and transactions',
};

export default function TracesPage() {
  return (
    <RoleGuard allowedRoles={['Admin', 'Editor']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Property Traces</h1>
            <p className="text-muted-foreground">
              Track sales history, transactions, and property updates
            </p>
          </div>
        </div>
        <TracesList />
      </div>
    </RoleGuard>
  );
}

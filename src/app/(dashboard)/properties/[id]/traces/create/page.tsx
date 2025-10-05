import { TraceForm } from '@/features/traces/components/TraceForm';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Property Trace | Real Estate Management',
  description: 'Add a new sale trace to property',
};

interface CreateTracePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CreateTracePage({ params }: CreateTracePageProps) {
  const { id } = await params;
  return (
    <RoleGuard allowedRoles={['Admin', 'Editor']}>
      <TraceForm propertyId={id} mode="create" />
    </RoleGuard>
  );
}

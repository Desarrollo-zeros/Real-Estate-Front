'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TraceForm } from '@/features/traces/components/TraceForm';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { tracesService } from '@/services/api';
import { PropertyTraceDto } from '@/types';
import { Loader2 } from 'lucide-react';

export default function EditTracePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const traceId = params?.traceId as string;
  const [trace, setTrace] = useState<PropertyTraceDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrace = async () => {
      try {
        const data = await tracesService.getTraceById(id, traceId);
        setTrace(data);
      } catch (err: any) {
        console.error('Failed to load trace:', err);
        setError(err.message || 'Failed to load trace');
      } finally {
        setLoading(false);
      }
    };

    loadTrace();
  }, [id, traceId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !trace) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-destructive">Failed to load trace</p>
        <button
          onClick={() => router.push(`/properties/${id}`)}
          className="text-primary hover:underline"
        >
          Back to Property
        </button>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['Admin', 'Editor']}>
      <TraceForm propertyId={id} trace={trace} mode="edit" />
    </RoleGuard>
  );
}

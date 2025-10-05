'use client';

import { PropertyDetail } from '@/features/properties/components/PropertyDetail';
import { useParams } from 'next/navigation';

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  
  return (
    <div className="space-y-6">
      <PropertyDetail id={id} />
    </div>
  );
}

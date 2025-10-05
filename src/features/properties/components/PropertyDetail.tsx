'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Edit, Trash2, ChevronLeft, ChevronRight, Building2, Calendar, Hash, User, Plus, History } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { propertiesService, tracesService } from '@/services/api';
import { PropertyDto, PropertyTraceDto } from '@/types';
import { getPropertyImageUrl } from '@/utils/imageUrl';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { ROUTES } from '@/utils/constants';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface PropertyDetailProps {
  id: string;
}

export function PropertyDetail({ id }: PropertyDetailProps) {
  const router = useRouter();
  const [property, setProperty] = useState<PropertyDto | null>(null);
  const [traces, setTraces] = useState<PropertyTraceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTraces, setLoadingTraces] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProperty();
    fetchTraces();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await propertiesService.getPropertyById(id);
      setProperty(response);
    } catch (error) {
      toast.error('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const fetchTraces = async () => {
    try {
      setLoadingTraces(true);
      const data = await tracesService.getTracesByProperty(id);
      setTraces(data);
    } catch (error) {
      console.error('Failed to load traces:', error);
    } finally {
      setLoadingTraces(false);
    }
  };

  const handleEdit = () => router.push(`${ROUTES.PROPERTIES}/${id}/edit`);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${property?.name}"?`)) return;
    try {
      setIsDeleting(true);
      await propertiesService.deleteProperty(id);
      toast.success('Property deleted successfully');
      router.push(ROUTES.PROPERTIES);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete property');
    } finally {
      setIsDeleting(false);
    }
  };

  const nextImage = () =>
    property?.images && setCurrentImageIndex((i) => (i + 1) % property.images!.length);
  const prevImage = () =>
    property?.images && setCurrentImageIndex((i) => (i - 1 + property.images!.length) % property.images!.length);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Property not found</p>
        <Button onClick={() => router.push('/properties')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header buttons */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push('/properties')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleEdit}
            className="hover:bg-primary/10 hover:border-primary transition-all"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={isDeleting}
            className="shadow-md hover:shadow-lg"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* IMAGE GALLERY */}
        <Card className="overflow-hidden relative shadow-lg">
          <CardContent className="p-0">
            {property.images && property.images.length > 0 ? (
              <div className="relative aspect-[4/3]">
                <motion.img
                  key={currentImageIndex}
                  src={getPropertyImageUrl(property.images[currentImageIndex].file)}
                  alt={property.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />

                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
                    >
                      <ChevronRight size={22} />
                    </button>
                    <div className="absolute bottom-4 right-4 bg-white/90 text-black px-3 py-1.5 rounded-full text-sm font-medium shadow">
                      {currentImageIndex + 1}/{property.images.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="aspect-[4/3] bg-neutral-100 flex items-center justify-center">
                <Building2 className="h-20 w-20 text-neutral-300" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* PROPERTY DETAILS */}
        <Card className="shadow-md border-neutral-200/60">
          <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-transparent p-6">
            <CardTitle className="text-3xl font-bold text-text">{property.name}</CardTitle>
            <p className="text-text-light mt-2">{property.address || 'No address available'}</p>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            {/* PRICE */}
            <div className="bg-gradient-to-br from-primary to-indigo-700 text-white rounded-2xl p-6 shadow-lg backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide opacity-80 mb-1">Price</p>
              <p className="text-5xl font-extrabold">{formatCurrency(property.price)}</p>
            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <div className="flex items-center gap-2 text-text-light text-sm mb-1">
                  <Calendar size={16} /> Year Built
                </div>
                <p className="text-xl font-semibold text-text">{property.year || 'N/A'}</p>
              </div>

              <div className="flex flex-col bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <div className="flex items-center gap-2 text-text-light text-sm mb-1">
                  <Hash size={16} /> Code
                </div>
                <p className="text-xl font-semibold text-text">{property.codeInternal || 'N/A'}</p>
              </div>
            </div>

            {/* OWNER */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-text-light text-sm mb-1">
                <User size={16} /> Property Owner
              </div>
              <button
                onClick={() => router.push(`/owners/${property.idOwner}`)}
                className="text-lg font-bold text-primary hover:text-primary/80 transition flex items-center gap-2"
              >
                {property.ownerName || property.owner?.name || 'N/A'}
                <ArrowLeft className="h-5 w-5 rotate-180" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PROPERTY TRACES / SALE HISTORY */}
      <Card className="shadow-md">
        <CardHeader className="border-b bg-gradient-to-r from-green-50 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-green-600" />
              <CardTitle>Sale History & Traces</CardTitle>
            </div>
            <Button
              size="sm"
              onClick={() => router.push(`/properties/${id}/traces/create`)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Trace
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loadingTraces ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : traces?.length > 0 ? (
            <div className="space-y-4">
              {traces.map((trace) => (
                <motion.div
                  key={trace.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-primary/50 hover:shadow-md transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{trace.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(trace.dateSale)}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Sale Value</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(trace.value)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Tax</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(trace.tax)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/properties/${id}/traces/${trace.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No sale history recorded yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/properties/${id}/traces/create`)}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add First Trace
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

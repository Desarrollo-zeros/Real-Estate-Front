'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Card, Loading, Badge } from '@/components/ui';
import { ownerService } from '@/services/api';
import { formatDate } from '@/utils/helpers';
import { getOwnerPhotoUrl } from '@/utils/imageUrl';
import { ROUTES } from '@/utils/constants';
import {
  ArrowLeft,
  Edit,
  MapPin,
  Calendar,
  Building2,
  X,
  ZoomIn,
} from 'lucide-react';
import type { OwnerDto } from '@/types';
import { useToast } from '@/hooks';

/**
 * Owner Details Page
 */
export default function OwnerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [owner, setOwner] = useState<OwnerDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadOwner();
  }, [id]);

  const loadOwner = async () => {
    try {
      setIsLoading(true);
      const ownerData = await ownerService.getOwnerById(id);
      setOwner(ownerData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load owner');
      router.push(ROUTES.OWNERS);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  if (!owner) {
    return (
      <div className="text-center py-12">
        <p className="text-text-light">Owner not found</p>
      </div>
    );
  }

  const totalValue =
    owner.properties?.reduce((sum, p) => sum + (p.price || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            leftIcon={<ArrowLeft className="h-5 w-5" />}
            onClick={() => router.back()}
          >
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-text">{owner.name}</h1>
            <p className="text-text-light mt-1">Owner Details</p>
          </div>
        </div>
        <Button
          leftIcon={<Edit className="h-5 w-5" />}
          onClick={() => router.push(`${ROUTES.OWNERS}/${id}/edit`)}
        >
          Edit Owner
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Owner Information */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-text mb-4">Owner Information</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-text-light mt-0.5" />
                  <div>
                    <p className="text-sm text-text-light">Address</p>
                    <p className="text-text font-medium">{owner.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-text-light mt-0.5" />
                  <div>
                    <p className="text-sm text-text-light">Birthday</p>
                    <p className="text-text font-medium">{formatDate(owner.birthday)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-text mb-4">Statistics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <span className="text-text-light text-sm">Total Properties</span>
                  <span className="text-2xl font-bold text-text">
                    {owner.properties?.length || 0}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-text-light text-sm">Total Value</span>
                  <span className="text-2xl font-bold text-primary">
                    ${totalValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Properties List */}
          {owner.properties && owner.properties.length > 0 && (
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-text">Properties</h2>
                  <Badge variant="secondary">
                    {owner.properties.length}{' '}
                    {owner.properties.length === 1 ? 'Property' : 'Properties'}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {owner.properties.map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                      onClick={() => router.push(`${ROUTES.PROPERTIES}/${property.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-text">{property.name}</p>
                          <p className="text-sm text-text-light">{property.address}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-text">
                          ${property.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-text-light">Year {property.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Photo */}
        <div>
          {owner.photo && (
            <Card className="h-full flex flex-col justify-center">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text mb-4">Photo</h3>
                <div
                  className="relative w-full rounded-lg overflow-hidden bg-neutral-100 cursor-pointer group"
                  onClick={() => setIsModalOpen(true)}
                >
                  <img
                    src={getOwnerPhotoUrl(owner.photo)}
                    alt={owner.name}
                    className="w-full h-[330px] object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de Imagen Expandida */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-5xl w-[90%] rounded-lg overflow-hidden animate-zoomIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={getOwnerPhotoUrl(owner.photo)}
              alt={owner.name}
              className="w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Animations */}
          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            @keyframes zoomIn {
              from {
                transform: scale(0.9);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
            .animate-fadeIn {
              animation: fadeIn 0.25s ease-out;
            }
            .animate-zoomIn {
              animation: zoomIn 0.3s ease-out;
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

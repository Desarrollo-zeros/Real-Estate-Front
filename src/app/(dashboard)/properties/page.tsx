'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, Building2, MapPin, Calendar, X, ZoomIn } from 'lucide-react';
import { Button, Card, Input, Loading, Badge } from '@/components/ui';
import { useAuth, useToast } from '@/hooks';
import { propertyService } from '@/services/api';
import { formatCurrency, debounce } from '@/utils/helpers';
import { getPropertyImageUrl } from '@/utils/imageUrl';
import { ROUTES } from '@/utils/constants';
import type { PropertyDto, PropertyFilterDto } from '@/types';

/**
 * Property List Page with filtering and pagination
 */
export default function PropertiesPage() {
  const router = useRouter();
  const { canCreate } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<PropertyDto[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState<PropertyFilterDto>({
    page: 1,
    pageSize: 20,
    sortBy: 'idProperty',
    sortOrder: 'desc',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const response = await propertyService.getProperties(filters);
      setProperties(response.items);
      setTotalItems(response.totalItems);
    } catch (error) {
      toast.error('Failed to load properties');
      console.error('Error loading properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = debounce((searchTerm: string) => {
    setFilters((prev) => ({ ...prev, name: searchTerm, page: 1 }));
  }, 500);




  const handlePriceFilter = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
    setShowFilters(false);
  };

  return (
    <div className="space-y-8">
  {/* Header */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div>
      <h1 className="text-4xl font-extrabold text-text tracking-tight">Properties</h1>
      <p className="text-text-light mt-1 text-sm sm:text-base">
        Manage your property portfolio ({totalItems} total)
      </p>
    </div>
    {canCreate && (
      <Button
        leftIcon={<Plus className="h-5 w-5" />}
        onClick={() => router.push(ROUTES.PROPERTY_CREATE)}
        className="bg-gradient-to-r from-primary to-indigo-600 text-white shadow-md hover:shadow-lg transition-all px-6 py-2"
      >
        Add Property
      </Button>
    )}
  </div>

  {/* Search + Filters */}
  <Card className="p-4 md:p-6 shadow-sm border border-neutral-200/60">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-light" />
        <input
          type="text"
          placeholder="Search by name or address..."
          className="input pl-10 border rounded-lg py-2.5 w-full text-sm focus:ring-2 focus:ring-primary/50 transition-all"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <Button
        variant="outline"
        leftIcon={<Filter className="h-5 w-5" />}
        onClick={() => setShowFilters(!showFilters)}
        className="border-neutral-300 hover:bg-primary/10 transition-all"
      >
        Filters
      </Button>
    </div>

    {showFilters && (
      <div className="mt-5 pt-5 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
        <Input
          label="Min Price"
          type="number"
          placeholder="0"
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, minPrice: Number(e.target.value) || undefined }))
          }
        />
        <Input
          label="Max Price"
          type="number"
          placeholder="1000000"
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) || undefined }))
          }
        />
        <div className="flex items-end">
          <Button
            onClick={handlePriceFilter}
            className="w-full bg-primary text-white font-semibold hover:shadow-md transition-all"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    )}
  </Card>

  {/* Grid of Properties */}
  {isLoading ? (
    <Loading message="Loading properties..." />
  ) : properties.length === 0 ? (
    <Card className="py-12 text-center bg-gradient-to-b from-neutral-50 to-white">
      <Building2 className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-text mb-2">No properties found</h3>
      <p className="text-text-light mb-6 text-sm">Start by adding your first property</p>
      {canCreate && (
        <Button
          leftIcon={<Plus className="h-5 w-5" />}
          onClick={() => router.push(ROUTES.PROPERTY_CREATE)}
          className="bg-primary text-white hover:shadow-md transition-all"
        >
          Add Property
        </Button>
      )}
    </Card>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )}

  {/* Pagination */}
  {totalItems > filters.pageSize! && (
    <div className="flex justify-center items-center gap-3 mt-6">
      <Button
        variant="outline"
        disabled={filters.page === 1}
        onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))}
      >
        Previous
      </Button>
      <span className="text-sm font-medium text-text">
        Page {filters.page} of {Math.ceil(totalItems / filters.pageSize!)}
      </span>
      <Button
        variant="outline"
        disabled={filters.page! >= Math.ceil(totalItems / filters.pageSize!)}
        onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
      >
        Next
      </Button>
    </div>
  )}
</div>
  );
}

/**
 * Image Modal Component with Transitions
 */
const ImageModal = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  altText 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  imageUrl: string; 
  altText: string; 
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-7xl max-h-[90vh] animate-zoomIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
        >
          <X className="h-8 w-8" />
        </button>
        <img
          src={getPropertyImageUrl(imageUrl)}
          alt={altText}
          className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
        />
      </div>
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
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-zoomIn {
          animation: zoomIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

/**
 * Property Card Component
 */
const PropertyCard = ({ property }: { property: PropertyDto }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleImageClick = (e: React.MouseEvent, imageUrl: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  return (
    <>
      <Link href={`${ROUTES.PROPERTIES}/${property.id}`}>
        <Card className="overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl border border-neutral-200 bg-white/90 backdrop-blur-sm">
          <div className="aspect-video relative bg-neutral-100 overflow-hidden">
            {property.images?.length ? (
              <>
                <img
                  src={getPropertyImageUrl(property.images[0].file)}
                  alt={property.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={(e) => handleImageClick(e, property.images![0].file)}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-300"
                >
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                {property.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 px-2 py-1 text-xs bg-black/70 text-white rounded-full">
                    +{property.images.length - 1} more
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <Building2 className="h-14 w-14 text-neutral-400" />
              </div>
            )}
          </div>

          <div className="p-4 space-y-2">
            <h3 className="text-lg font-semibold text-text truncate">{property.name}</h3>
            <div className="text-sm text-text-light space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary/70" />
                <span className="truncate">{property.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary/70" />
                <span>Built in {property.year}</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <p className="text-lg font-bold text-primary">{formatCurrency(property.price)}</p>
              <Badge variant="secondary" className="text-xs font-semibold">
                {property.codeInternal}
              </Badge>
            </div>
          </div>
        </Card>
      </Link>

      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={selectedImage}
        altText={property.name}
      />
    </>
  );
};


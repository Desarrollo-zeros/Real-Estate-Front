"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Card, Input, Loading } from '@/components/ui';
import { useToast } from '@/hooks';
import { propertyService, ownerService } from '@/services/api';
import { getPropertyImageUrl } from '@/utils/imageUrl';
import { ROUTES } from '@/utils/constants';
import { ArrowLeft, Save, Upload, X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import type { PropertyDto, UpdatePropertyDto, PropertyImageDto, OwnerDto } from '@/types';

/**
 * Edit Property Page
 */
export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || '0';
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<UpdatePropertyDto>>({});
  const [existingImages, setExistingImages] = useState<PropertyImageDto[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  useEffect(() => {
    loadProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProperty = async () => {
    try {
      setIsLoading(true);
      const property = await propertyService.getPropertyById(id);
      setFormData({
        id: id,
        name: property.name,
        address: property.address,
        price: property.price,
        codeInternal: property.codeInternal,
        year: property.year,
      });
      setExistingImages(property.images || []);
    } catch (error: any) {
      toast.error('Failed to load property');
      router.push(ROUTES.PROPERTIES);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeNewFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteExistingImage = async (imageId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this image?');
    if (!confirmed) return;

    try {
      setIsDeletingImage(true);
      await propertyService.deletePropertyImage(id, imageId);
      setExistingImages((prev) => prev.filter((img) => img.idPropertyImage !== imageId));
      setCurrentImageIndex((prev) => Math.max(0, prev - 1));
      toast.success('Image deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete image');
    } finally {
      setIsDeletingImage(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % existingImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + existingImages.length) % existingImages.length);
  };

  const handleNumberChange = (field: 'price' | 'year', e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Allow empty input
    if (value === '') {
      setFormData({ ...formData, [field]: 0 });
      return;
    }

    // Only allow digits
    value = value.replace(/[^0-9]/g, '');

    // Remove leading zeros while typing
    if (value.length > 1 && value.startsWith('0')) {
      value = value.replace(/^0+/, '');
    }

    // If all zeros were removed, set to 0
    if (value === '') {
      value = '0';
    }

    const numValue = Number(value);

    if (!isNaN(numValue) && numValue >= 0) {
      setFormData({ ...formData, [field]: numValue });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Update property first
      await propertyService.updateProperty(id, formData as UpdatePropertyDto);

      // Upload new images if any
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map((file) =>
          propertyService.uploadPropertyImage(id, file)
        );
        await Promise.all(uploadPromises);
        toast.success(`Property updated with ${selectedFiles.length} new image(s)`);
      } else {
        toast.success('Property updated successfully');
      }

      router.push(`${ROUTES.PROPERTIES}/${id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update property');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen message="Loading property..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-text-light hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-1" /> Back
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-text tracking-tight">Edit Property</h1>
            <p className="text-text-light text-sm">Update details, images and pricing</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="edit-property-form"
            leftIcon={<Save className="h-5 w-5" />} 
            disabled={isSubmitting}
            className="bg-gradient-to-r from-primary to-indigo-600 text-white shadow-md hover:shadow-lg transition-all"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Form */}
      <form id="edit-property-form" onSubmit={handleSubmit}>
        <Card className="shadow-sm border border-neutral-200/60 dark:border-neutral-800 mt-4">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Property Name"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Address"
              required
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Input
              label="Price"
              type="number"
              min={1}
              required
              value={formData.price || 0}
              onChange={(e) => handleNumberChange('price', e)}
            />
            <Input
              label="Year Built"
              type="number"
              min={1900}
              max={new Date().getFullYear()}
              required
              value={formData.year || 0}
              onChange={(e) => handleNumberChange('year', e)}
            />
            <Input
              label="Internal Code"
              value={formData.codeInternal || ''}
              onChange={(e) => setFormData({ ...formData, codeInternal: e.target.value })}
            />
          </div>
        </Card>

        {/* Existing Images Carousel */}
        {existingImages.length > 0 && (
          <Card className="mt-6 overflow-hidden">
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-text flex items-center gap-2">
                Current Images
                <span className="text-text-light text-sm">({existingImages.length})</span>
              </h3>

              <div className="relative rounded-xl overflow-hidden shadow-md">
                <img
                  src={getPropertyImageUrl(existingImages[currentImageIndex]?.file)}
                  alt={`Image ${currentImageIndex + 1}`}
                  className="w-full h-[400px] object-cover transition-transform duration-500 hover:scale-105"
                />

                {existingImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => deleteExistingImage(existingImages[currentImageIndex]?.idPropertyImage)}
                  disabled={isDeletingImage}
                  className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-white text-xs tracking-wide">
                  {currentImageIndex + 1} / {existingImages.length}
                </div>
              </div>

              <div className="grid grid-cols-6 md:grid-cols-8 gap-2 pt-2">
                {existingImages.map((image, index) => (
                  <button
                    key={image.idPropertyImage}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex
                        ? 'border-primary ring-2 ring-primary/40'
                        : 'border-neutral-300 hover:border-primary/50 transition'
                    }`}
                  >
                    <img
                      src={getPropertyImageUrl(image.file)}
                      alt={`Thumbnail ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Upload New Images */}
        <Card className="mt-6">
          <div className="p-6">
            <label className="block text-sm font-semibold text-text mb-3">
              Add New Images
              <span className="text-text-light font-normal ml-2">(optional)</span>
            </label>
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center px-8 py-10 border-2 border-dashed border-neutral-300 rounded-xl bg-gradient-to-br from-white/80 to-neutral-50 hover:from-white hover:to-neutral-100 transition-all cursor-pointer"
            >
              <Upload className="h-10 w-10 text-primary mb-3" />
              <p className="text-sm text-text">
                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-text-light mt-1">PNG, JPG, JPEG up to 10MB</p>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>

            {selectedFiles.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="rounded-lg object-cover aspect-square shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewFile(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <p className="text-xs text-text-light mt-1 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
}

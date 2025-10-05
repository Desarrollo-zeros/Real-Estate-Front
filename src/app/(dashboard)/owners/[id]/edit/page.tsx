'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Card, Input, Loading } from '@/components/ui';
import { useToast } from '@/hooks';
import { ownerService } from '@/services/api';
import { ROUTES } from '@/utils/constants';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import type { UpdateOwnerDto, OwnerDto } from '@/types';

/**
 * Edit Owner Page
 */
export default function EditOwnerPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [formData, setFormData] = useState<Partial<UpdateOwnerDto>>({
    id: '',
    name: '',
    address: '',
    birthday: '',
    photo: '',
  });

  useEffect(() => {
    loadOwner();
  }, [id]);

  const loadOwner = async () => {
    try {
      setIsLoading(true);
      const owner = await ownerService.getOwnerById(id);
      
      setFormData({
        id: owner.idOwner,
        name: owner.name,
        address: owner.address,
        birthday: owner.birthday.split('T')[0], // Format date for input
        photo: owner.photo,
      });

      // Set existing photo preview if available
      if (owner.photo) {
        setPhotoPreview(owner.photo);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load owner');
      router.push(ROUTES.OWNERS);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
    setFormData({ ...formData, photo: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Prepare owner data with photo as base64 if available
      const ownerData: UpdateOwnerDto = {
        id: id,
        name: formData.name!,
        address: formData.address!,
        birthday: formData.birthday!,
        photo: photoPreview || undefined,
      };

      await ownerService.updateOwner(id, ownerData);
      toast.success('Owner updated successfully');
      router.push(ROUTES.OWNERS);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update owner');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          leftIcon={<ArrowLeft className="h-5 w-5" />}
          onClick={() => router.back()}
        >
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-text">Edit Owner</h1>
          <p className="text-text-light mt-1">Update owner information</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <div className="p-6 space-y-4">
            <Input
              label="Owner Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., John Doe"
            />

            <Input
              label="Address"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g., 123 Main Street, New York, NY"
            />

            <Input
              label="Birthday"
              type="date"
              required
              value={formData.birthday}
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
            />

            {/* Photo Upload */}
            <div>
              <label className="label">
                Photo
                <span className="text-text-light text-sm font-normal ml-2">
                  (Optional - Profile photo)
                </span>
              </label>
              
              {!photoPreview ? (
                <div className="mt-2">
                  <label
                    htmlFor="photo-upload"
                    className="flex items-center justify-center px-6 py-8 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-text-light" />
                      <p className="mt-2 text-sm text-text">
                        <span className="font-medium text-primary">Click to upload</span> or drag and
                        drop
                      </p>
                      <p className="text-xs text-text-light mt-1">
                        PNG, JPG, JPEG up to 5MB
                      </p>
                    </div>
                    <input
                      id="photo-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </label>
                </div>
              ) : (
                <div className="mt-2">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-neutral-100">
                      <img
                        src={photoPreview}
                        alt="Owner photo preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Remove photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-text-light mt-2">
                    {photoFile?.name || 'Current photo'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            leftIcon={<Save className="h-5 w-5" />}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Owner'}
          </Button>
        </div>
      </form>
    </div>
  );
}

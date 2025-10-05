'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Input, Select } from '@/components/ui';
import { useToast } from '@/hooks';
import { propertyService, ownerService } from '@/services/api';
import { ROUTES } from '@/utils/constants';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import type { CreatePropertyDto, OwnerDto } from '@/types';

/**
 * Create Property Page
 */
export default function CreatePropertyPage() {
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [owners, setOwners] = useState<OwnerDto[]>([]);
  const [isLoadingOwners, setIsLoadingOwners] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<Partial<CreatePropertyDto>>({
    name: '',
    address: '',
    price: 0,
    codeInternal: '',
    year: new Date().getFullYear(),
    idOwner: '',
  });
  const [year, setYear] = useState(new Date().getFullYear());
  const [price, setPrice] = useState(0);

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    try {
      setIsLoadingOwners(true);
      const ownersData = await ownerService.getAllOwners();
      setOwners(ownersData);
    } catch (error) {
      toast.error('Failed to load owners');
      console.error('Error loading owners:', error);
    } finally {
      setIsLoadingOwners(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNumberChange = (field: 'price' | 'year', e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty input
    if (value === '') {
      if (field === 'year') {
        setYear(0);
      } else if (field === 'price') {
        setPrice(0);
      }
      setFormData({ ...formData, [field]: 0 });
      return;
    }
    
    // Remove leading zeros and convert to number
    const sanitized = value.replace(/^0+/, '') || '0';
    const numValue = Number(sanitized);
    
    // Only update if it's a valid number
    if (!isNaN(numValue) && numValue >= 0) {
      if (field === 'year') {
        setYear(numValue);
      } else if (field === 'price') {
        setPrice(numValue);
      }
      setFormData({ ...formData, [field]: numValue });
      
      // Force the input to show sanitized value
      e.target.value = String(numValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.idOwner || formData.idOwner === '') {
      toast.error('Please select an owner');
      return;
    }

    try {
      setIsSubmitting(true);

      // Create property first
      const createdProperty = await propertyService.createProperty(formData as CreatePropertyDto);

      // Upload images if any
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map((file) =>
          propertyService.uploadPropertyImage(createdProperty.id, file)
        );
        await Promise.all(uploadPromises);
        toast.success(`Property created with ${selectedFiles.length} image(s)`);
      } else {
        toast.success('Property created successfully');
      }

      router.push(ROUTES.PROPERTIES);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create property');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-text">Create Property</h1>
          <p className="text-text-light mt-1">Add a new property to your portfolio</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <div className="p-6 space-y-4">
            <Input
              label="Property Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Modern Downtown Apartment"
            />

            <Input
              label="Address"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g., 123 Main Street, New York, NY"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Price"
                type="number"
                min={1}
                required
                value={price}
                onChange={(e) => handleNumberChange('price', e)}
                placeholder="0"
              />

              <Input
                label="Year Built"
                type="number"
                min={1900}
                max={new Date().getFullYear()}
                required
                value={year}
                onChange={(e) => handleNumberChange('year', e)}
                placeholder={new Date().getFullYear().toString()}
              />
            </div>

            <Input
              label="Internal Code"
              value={formData.codeInternal}
              onChange={(e) =>
                setFormData({ ...formData, codeInternal: e.target.value })
              }
              placeholder="e.g., PROP-001"
            />

            {/* Owner Selection */}
            <Select
              label="Owner"
              required
              value={formData.idOwner}
              onChange={(e) =>
                setFormData({ ...formData, idOwner: e.target.value })
              }
              options={owners.map((owner) => ({
                value: owner.idOwner,
                label: owner.name,
              }))}
              disabled={isLoadingOwners}
            />
          </div>
        </Card>

        {/* Property Images Upload */}
        <Card className="mt-6">
          <div className="p-6 space-y-4">
            <div>
              <label className="label">
                Property Images
                <span className="text-text-light text-sm font-normal ml-2">
                  (Optional - Upload photos of the property)
                </span>
              </label>
              <div className="mt-2">
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center px-6 py-8 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
                >
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-text-light" />
                    <p className="mt-2 text-sm text-text">
                      <span className="font-medium text-primary">Click to upload</span> or drag and
                      drop
                    </p>
                    <p className="text-xs text-text-light mt-1">
                      PNG, JPG, JPEG up to 10MB each
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-text">
                  Selected Files ({selectedFiles.length}):
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <p className="text-xs text-text-light mt-1 truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            {isSubmitting ? 'Creating...' : 'Create Property'}
          </Button>
        </div>
      </form>
    </div>
  );
}

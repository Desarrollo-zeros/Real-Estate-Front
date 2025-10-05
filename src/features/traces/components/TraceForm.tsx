'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Save } from 'lucide-react';
import { tracesService, propertyService } from '@/services/api';
import toast from 'react-hot-toast';
import type { PropertyTraceDto, CreatePropertyTraceDto, UpdatePropertyTraceDto, PropertyDto } from '@/types';

interface TraceFormProps {
  propertyId: string;
  trace?: PropertyTraceDto;
  mode: 'create' | 'edit';
}

export function TraceForm({ propertyId, trace, mode }: TraceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<PropertyDto | null>(null);
  const [price, setPrice] = useState(1000);
  const [formData, setFormData] = useState({
    dateSale: trace?.dateSale.split('T')[0] || new Date().toISOString().split('T')[0],
    name: trace?.name || '',
    value: trace?.value || 0,
    tax: trace?.tax || 0,
  });

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const propertyData = await propertyService.getPropertyById(propertyId);
        setProperty(propertyData);
      } catch (error) {
        console.error('Failed to load property:', error);
        toast.error('Failed to load property details');
      }
    };
    loadProperty();
  }, [propertyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data: CreatePropertyTraceDto | UpdatePropertyTraceDto = {
        dateSale: formData.dateSale,
        name: formData.name,
        value: Number(formData.value),
        tax: Number(formData.tax),
      };

      if (mode === 'create') {
        await tracesService.createTrace(propertyId, data as CreatePropertyTraceDto);
        toast.success('Trace created successfully');
      } else if (trace) {
        await tracesService.updateTrace(propertyId, trace.id, data as UpdatePropertyTraceDto);
        toast.success('Trace updated successfully');
      }

      router.push(`/properties/${propertyId}`);
      router.refresh();
    } catch (error: any) {
      console.error(`Failed to ${mode} trace:`, error);
      toast.error(error.message || `Failed to ${mode} trace`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = ( e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty input
    if (value === '') {
      setPrice(0);
      setFormData({ ...formData, value: 0 });
      return;
    }
    // Remove leading zeros and convert to number
    const sanitized = value.replace(/^0+/, '') || '0';
    const numValue = Number(sanitized);
    // Only update if it's a valid number
    if (!isNaN(numValue) && numValue >= 0) {
      setPrice(numValue);
      setFormData({ ...formData, value: numValue });
      // Force the input to show sanitized value
      e.target.value = String(numValue);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push(`/properties/${propertyId}`)}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Property
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {mode === 'create' ? 'Create' : 'Edit'} Property Trace
          </h1>
          {property && (
            <p className="text-muted-foreground mt-1">
              For property: {property.name}
            </p>
          )}
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Sale */}
            <div className="space-y-2">
              <Label htmlFor="dateSale">
                Sale Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dateSale"
                type="date"
                value={formData.dateSale}
                onChange={(e) => handleChange('dateSale', e.target.value)}
                required
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Transaction Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Initial Sale, Price Update"
                required
                minLength={3}
                maxLength={200}
              />
            </div>

            {/* Value */}
            <div className="space-y-2">
              <Label htmlFor="value">
                Sale Value <span className="text-destructive">*</span>
              </Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => handleNumberChange(e)}
                placeholder="0.00"
                required
              />
            </div>

            {/* Tax */}
            <div className="space-y-2">
              <Label htmlFor="tax">
                Tax Amount <span className="text-destructive">*</span>
              </Label>
              <Input
                id="tax"
                type="number"
                step="0.01"
                min="0"
                value={formData.tax}
                onChange={(e) => handleChange('tax', Number(e.target.value))}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/properties/${propertyId}`)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : mode === 'create' ? 'Create Trace' : 'Update Trace'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

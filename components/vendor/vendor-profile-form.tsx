'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  vendorProfileUpdateSchema,
  VendorProfileUpdateFormData,
} from '@/lib/validations/vendor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Vendor } from '@/types/vendor';
import { useEffect } from 'react';

interface VendorProfileFormProps {
  vendor: Vendor;
  onSubmit: (data: VendorProfileUpdateFormData) => Promise<void>;
  isLoading?: boolean;
}

export function VendorProfileForm({
  vendor,
  onSubmit,
  isLoading = false,
}: VendorProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VendorProfileUpdateFormData>({
    resolver: zodResolver(vendorProfileUpdateSchema),
    defaultValues: {
      businessName: vendor.businessName,
      businessDescription: vendor.businessDescription || '',
      businessEmail: vendor.businessEmail,
      businessPhone: vendor.businessPhone,
      website: vendor.website || '',
      street: vendor.businessAddress?.street || '',
      city: vendor.businessAddress?.city || '',
      state: vendor.businessAddress?.state || '',
      zipCode: vendor.businessAddress?.zipCode || '',
      country: vendor.businessAddress?.country || '',
      taxId: vendor.taxId || '',
      registrationNumber: vendor.registrationNumber || '',
    },
  });

  useEffect(() => {
    reset({
      businessName: vendor.businessName,
      businessDescription: vendor.businessDescription || '',
      businessEmail: vendor.businessEmail,
      businessPhone: vendor.businessPhone,
      website: vendor.website || '',
      street: vendor.businessAddress?.street || '',
      city: vendor.businessAddress?.city || '',
      state: vendor.businessAddress?.state || '',
      zipCode: vendor.businessAddress?.zipCode || '',
      country: vendor.businessAddress?.country || '',
      taxId: vendor.taxId || '',
      registrationNumber: vendor.registrationNumber || '',
    });
  }, [vendor, reset]);

  const onFormSubmit = async (data: VendorProfileUpdateFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Business Information
        </h3>
        <div className="space-y-4">
          <Input
            label="Business Name *"
            {...register('businessName')}
            error={errors.businessName?.message}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Description
            </label>
            <textarea
              {...register('businessDescription')}
              rows={4}
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Describe your business..."
            />
            {errors.businessDescription && (
              <p className="mt-1 text-sm text-red-600">
                {errors.businessDescription.message}
              </p>
            )}
          </div>
          <Input
            label="Business Email *"
            type="email"
            {...register('businessEmail')}
            error={errors.businessEmail?.message}
          />
          <Input
            label="Business Phone *"
            type="tel"
            {...register('businessPhone')}
            error={errors.businessPhone?.message}
          />
          <Input
            label="Website (Optional)"
            type="url"
            {...register('website')}
            error={errors.website?.message}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Business Address
        </h3>
        <div className="space-y-4">
          <Input
            label="Street Address *"
            {...register('street')}
            error={errors.street?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City *"
              {...register('city')}
              error={errors.city?.message}
            />
            <Input
              label="State *"
              {...register('state')}
              error={errors.state?.message}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ZIP Code *"
              {...register('zipCode')}
              error={errors.zipCode?.message}
            />
            <Input
              label="Country *"
              {...register('country')}
              error={errors.country?.message}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Legal Information
        </h3>
        <div className="space-y-4">
          <Input
            label="Tax ID (Optional)"
            {...register('taxId')}
            error={errors.taxId?.message}
          />
          <Input
            label="Registration Number (Optional)"
            {...register('registrationNumber')}
            error={errors.registrationNumber?.message}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}

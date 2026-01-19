'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema, AddressFormData } from '@/lib/validations/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Address } from '@/types/profile';
import { useEffect } from 'react';

interface AddressFormProps {
  address?: Address;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function AddressForm({
  address,
  onSubmit,
  onCancel,
  isLoading = false,
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: address?.label || '',
      street: address?.street || '',
      city: address?.city || '',
      state: address?.state || '',
      zipCode: address?.zipCode || '',
      country: address?.country || '',
      isDefault: address?.isDefault || false,
    },
  });

  useEffect(() => {
    if (address) {
      reset({
        label: address.label,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        isDefault: address.isDefault,
      });
    }
  }, [address, reset]);

  const onFormSubmit = async (data: AddressFormData) => {
    await onSubmit(data);
    if (!address) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <Input
        label="Address Label"
        type="text"
        placeholder="Home, Work, etc."
        {...register('label')}
        error={errors.label?.message}
      />

      <Input
        label="Street Address"
        type="text"
        autoComplete="street-address"
        {...register('street')}
        error={errors.street?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="City"
          type="text"
          autoComplete="address-level2"
          {...register('city')}
          error={errors.city?.message}
        />

        <Input
          label="State/Province"
          type="text"
          autoComplete="address-level1"
          {...register('state')}
          error={errors.state?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="ZIP/Postal Code"
          type="text"
          autoComplete="postal-code"
          {...register('zipCode')}
          error={errors.zipCode?.message}
        />

        <Input
          label="Country"
          type="text"
          autoComplete="country-name"
          {...register('country')}
          error={errors.country?.message}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isDefault"
          {...register('isDefault')}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
          Set as default address
        </label>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isLoading}>
          {address ? 'Update Address' : 'Add Address'}
        </Button>
      </div>
    </form>
  );
}

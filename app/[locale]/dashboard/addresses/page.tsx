'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/lib/api/profile';
import { Address } from '@/types/profile';
import { AddressFormData } from '@/lib/validations/profile';
import { AddressList } from '@/components/profile/address-list';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export default function AddressesPage() {
  const queryClient = useQueryClient();

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => profileApi.getAddresses(),
  });

  const addAddressMutation = useMutation({
    mutationFn: (data: AddressFormData) => profileApi.addAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address added successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to add address');
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddressFormData }) =>
      profileApi.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update address');
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (id: string) => profileApi.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete address');
    },
  });

  const setDefaultAddressMutation = useMutation({
    mutationFn: (id: string) => profileApi.setDefaultAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Default address updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to set default address');
    },
  });

  const handleAdd = async (data: AddressFormData) => {
    await addAddressMutation.mutateAsync(data);
  };

  const handleEdit = async (id: string, data: AddressFormData) => {
    await updateAddressMutation.mutateAsync({ id, data });
  };

  const handleDelete = async (id: string) => {
    await deleteAddressMutation.mutateAsync(id);
  };

  const handleSetDefault = async (id: string) => {
    await setDefaultAddressMutation.mutateAsync(id);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Addresses</h1>
          <p className="mt-2 text-gray-600">
            Manage your shipping and billing addresses
          </p>
        </div>

        <div className="mt-6">
          <AddressList
            addresses={addresses}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSetDefault={handleSetDefault}
            isLoading={
              addAddressMutation.isPending ||
              updateAddressMutation.isPending ||
              deleteAddressMutation.isPending ||
              setDefaultAddressMutation.isPending
            }
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

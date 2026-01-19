'use client';

import { Address } from '@/types/profile';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MapPin, Check } from 'lucide-react';
import { useState } from 'react';
import { AddressForm } from './address-form';

interface AddressListProps {
  addresses: Address[];
  onEdit: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onSetDefault: (id: string) => Promise<void>;
  onAdd: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export function AddressList({
  addresses,
  onEdit,
  onDelete,
  onSetDefault,
  onAdd,
  isLoading = false,
}: AddressListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleEdit = async (id: string, data: any) => {
    await onEdit(id, data);
    setEditingId(null);
  };

  const handleAdd = async (data: any) => {
    await onAdd(data);
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      await onDelete(id);
    }
  };

  if (showAddForm) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
        <AddressForm
          onSubmit={handleAdd}
          onCancel={() => setShowAddForm(false)}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Saved Addresses</h3>
        <Button onClick={() => setShowAddForm(true)} size="sm">
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No addresses saved yet</p>
          <Button onClick={() => setShowAddForm(true)}>Add Your First Address</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id}>
              {editingId === address.id ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-md font-semibold mb-4">Edit Address</h4>
                  <AddressForm
                    address={address}
                    onSubmit={(data) => handleEdit(address.id, data)}
                    onCancel={() => setEditingId(null)}
                    isLoading={isLoading}
                  />
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {address.label}
                        </h4>
                        {address.isDefault && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded">
                            <Check className="h-3 w-3" />
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {address.street}
                        <br />
                        {address.city}, {address.state} {address.zipCode}
                        <br />
                        {address.country}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSetDefault(address.id)}
                          disabled={isLoading}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(address.id)}
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(address.id)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

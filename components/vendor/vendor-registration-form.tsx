'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  vendorBusinessInfoSchema,
  vendorAddressSchema,
  vendorLegalInfoSchema,
  VendorBusinessInfoFormData,
  VendorAddressFormData,
  VendorLegalInfoFormData,
} from '@/lib/validations/vendor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { vendorApi } from '@/lib/api/vendor';
import { VendorRegistrationRequest } from '@/types/vendor';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, Circle, Upload, X, FileText } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Business Information', description: 'Basic business details' },
  { id: 2, title: 'Business Address', description: 'Physical location' },
  { id: 3, title: 'Legal Information', description: 'Tax ID and registration' },
  { id: 4, title: 'Verification Documents', description: 'Upload required documents' },
] as const;

interface VendorRegistrationFormProps {
  onSuccess?: () => void;
}

export function VendorRegistrationForm({
  onSuccess,
}: VendorRegistrationFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);

  // Form data stored in state
  const [formData, setFormData] = useState<{
    businessInfo?: VendorBusinessInfoFormData;
    address?: VendorAddressFormData;
    legalInfo?: VendorLegalInfoFormData;
  }>({});

  // Step 1: Business Information
  const businessInfoForm = useForm<VendorBusinessInfoFormData>({
    resolver: zodResolver(vendorBusinessInfoSchema),
    defaultValues: formData.businessInfo,
  });

  // Step 2: Business Address
  const addressForm = useForm<VendorAddressFormData>({
    resolver: zodResolver(vendorAddressSchema),
    defaultValues: formData.address,
  });

  // Step 3: Legal Information
  const legalInfoForm = useForm<VendorLegalInfoFormData>({
    resolver: zodResolver(vendorLegalInfoSchema),
    defaultValues: formData.legalInfo,
  });

  const handleNext = async () => {
    let isValid = false;
    let stepData: any;

    if (currentStep === 1) {
      isValid = await businessInfoForm.trigger();
      if (isValid) {
        stepData = businessInfoForm.getValues();
        setFormData((prev) => ({ ...prev, businessInfo: stepData }));
      }
    } else if (currentStep === 2) {
      isValid = await addressForm.trigger();
      if (isValid) {
        stepData = addressForm.getValues();
        setFormData((prev) => ({ ...prev, address: stepData }));
      }
    } else if (currentStep === 3) {
      isValid = await legalInfoForm.trigger();
      if (isValid) {
        stepData = legalInfoForm.getValues();
        setFormData((prev) => ({ ...prev, legalInfo: stepData }));
      }
    } else if (currentStep === 4) {
      // Final step - submit form
      await handleSubmit();
      return;
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!formData.businessInfo || !formData.address || documents.length === 0) {
      toast.error('Please complete all steps and upload at least one document');
      return;
    }

    setIsSubmitting(true);
    try {
      const registrationData: VendorRegistrationRequest = {
        ...formData.businessInfo,
        ...formData.address,
        ...formData.legalInfo,
        documents,
      };

      await vendorApi.register(registrationData);
      toast.success('Vendor registration submitted successfully!');
      onSuccess?.();
      router.push('/vendor/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit vendor registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDocuments((prev) => [...prev, ...files]);
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep > step.id
                      ? 'bg-green-500 border-green-500 text-white'
                      : currentStep === step.id
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <span className="font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Step 1: Business Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Business Information
            </h2>
            <Input
              label="Business Name *"
              {...businessInfoForm.register('businessName')}
              error={businessInfoForm.formState.errors.businessName?.message}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Description
              </label>
              <textarea
                {...businessInfoForm.register('businessDescription')}
                rows={4}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe your business..."
              />
              {businessInfoForm.formState.errors.businessDescription && (
                <p className="mt-1 text-sm text-red-600">
                  {businessInfoForm.formState.errors.businessDescription.message}
                </p>
              )}
            </div>
            <Input
              label="Business Email *"
              type="email"
              {...businessInfoForm.register('businessEmail')}
              error={businessInfoForm.formState.errors.businessEmail?.message}
            />
            <Input
              label="Business Phone *"
              type="tel"
              {...businessInfoForm.register('businessPhone')}
              error={businessInfoForm.formState.errors.businessPhone?.message}
            />
            <Input
              label="Website (Optional)"
              type="url"
              {...businessInfoForm.register('website')}
              error={businessInfoForm.formState.errors.website?.message}
            />
          </div>
        )}

        {/* Step 2: Business Address */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Business Address
            </h2>
            <Input
              label="Street Address *"
              {...addressForm.register('street')}
              error={addressForm.formState.errors.street?.message}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City *"
                {...addressForm.register('city')}
                error={addressForm.formState.errors.city?.message}
              />
              <Input
                label="State *"
                {...addressForm.register('state')}
                error={addressForm.formState.errors.state?.message}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ZIP Code *"
                {...addressForm.register('zipCode')}
                error={addressForm.formState.errors.zipCode?.message}
              />
              <Input
                label="Country *"
                {...addressForm.register('country')}
                error={addressForm.formState.errors.country?.message}
              />
            </div>
          </div>
        )}

        {/* Step 3: Legal Information */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Legal Information
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Provide your business registration and tax information (if applicable).
            </p>
            <Input
              label="Tax ID (Optional)"
              {...legalInfoForm.register('taxId')}
              error={legalInfoForm.formState.errors.taxId?.message}
            />
            <Input
              label="Registration Number (Optional)"
              {...legalInfoForm.register('registrationNumber')}
              error={legalInfoForm.formState.errors.registrationNumber?.message}
            />
          </div>
        )}

        {/* Step 4: Verification Documents */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Verification Documents
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload required documents for verification. Accepted formats: PDF, JPEG, PNG (Max 5MB each).
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                id="documents"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="documents"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Click to upload documents
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PDF, JPEG, or PNG (Max 5MB each)
                </span>
              </label>
            </div>
            {documents.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">Uploaded Documents:</p>
                {documents.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            isLoading={isSubmitting}
            disabled={isSubmitting || (currentStep === 4 && documents.length === 0)}
          >
            {currentStep === 4 ? 'Submit Registration' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}

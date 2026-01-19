'use client';

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  productBasicInfoSchema,
  productPricingSchema,
  productShippingSchema,
  productSeoSchema,
  productAttributeSchema,
  productVariationSchema,
  ProductBasicInfoFormData,
  ProductPricingFormData,
  ProductShippingFormData,
  ProductSeoFormData,
  ProductAttributeFormData,
  ProductVariationFormData,
} from '@/lib/validations/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { productApi } from '@/lib/api/product';
import { Category, ProductAttributeInput, ProductVariationInput } from '@/types/product';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, Circle, Upload, X, Plus, Trash2, HelpCircle, Save } from 'lucide-react';
import { AttributeType } from '@/types/product';

const STEPS = [
  { id: 1, title: 'Basic Information', description: 'Product name and description' },
  { id: 2, title: 'Pricing & Inventory', description: 'Price and stock details' },
  { id: 3, title: 'Shipping & Physical', description: 'Shipping and dimensions' },
  { id: 4, title: 'SEO & Metadata', description: 'Search optimization' },
  { id: 5, title: 'Images & Media', description: 'Product images' },
  { id: 6, title: 'Attributes', description: 'Product specifications' },
  { id: 7, title: 'Variations', description: 'Size, color, and other variants' },
] as const;

interface ProductListingFormProps {
  onSuccess?: () => void;
  productId?: string; // For editing
}

export function ProductListingForm({
  onSuccess,
  productId,
}: ProductListingFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<{ id: string; url: string; isPrimary: boolean }[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form data stored in state
  const [formData, setFormData] = useState<{
    basicInfo?: ProductBasicInfoFormData;
    pricing?: ProductPricingFormData;
    shipping?: ProductShippingFormData;
    seo?: ProductSeoFormData;
    attributes?: ProductAttributeFormData[];
    variations?: ProductVariationFormData[];
  }>({});

  // Step 1: Basic Information
  const basicInfoForm = useForm<ProductBasicInfoFormData>({
    resolver: zodResolver(productBasicInfoSchema),
    defaultValues: formData.basicInfo,
  });

  // Step 2: Pricing & Inventory
  const pricingForm = useForm<ProductPricingFormData>({
    resolver: zodResolver(productPricingSchema),
    defaultValues: formData.pricing || {
      stockQuantity: 0,
      trackInventory: true,
      allowBackorder: false,
    },
  });

  // Step 3: Shipping & Physical
  const shippingForm = useForm<ProductShippingFormData>({
    resolver: zodResolver(productShippingSchema),
    defaultValues: formData.shipping || {
      isDigital: false,
      requiresShipping: true,
    },
  });

  // Step 4: SEO & Metadata
  const seoForm = useForm<ProductSeoFormData>({
    resolver: zodResolver(productSeoSchema),
    defaultValues: formData.seo,
  });

  // Attributes
  const attributesForm = useForm<{ attributes: ProductAttributeFormData[] }>({
    defaultValues: { attributes: formData.attributes || [] },
  });

  const { fields: attributeFields, append: appendAttribute, remove: removeAttribute } = useFieldArray({
    control: attributesForm.control,
    name: 'attributes',
  });

  // Variations
  const variationsForm = useForm<{ variations: ProductVariationFormData[] }>({
    defaultValues: { variations: formData.variations || [] },
  });

  const { fields: variationFields, append: appendVariation, remove: removeVariation } = useFieldArray({
    control: variationsForm.control,
    name: 'variations',
  });

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await productApi.getCategories({ isActive: true, includeChildren: true });
        setCategories(cats);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();
  }, []);

  // Load product data if editing
  useEffect(() => {
    if (productId) {
      const loadProduct = async () => {
        try {
          const product = await productApi.getProduct(productId);
          // Populate forms with product data
          basicInfoForm.reset({
            name: product.name,
            description: product.description || '',
            shortDescription: product.shortDescription || '',
            categoryId: product.categoryId || '',
            sku: product.sku || '',
            barcode: product.barcode || '',
          });
          pricingForm.reset({
            price: product.price,
            compareAtPrice: product.compareAtPrice,
            costPrice: product.costPrice,
            stockQuantity: product.stockQuantity,
            lowStockThreshold: product.lowStockThreshold,
            trackInventory: product.trackInventory,
            allowBackorder: product.allowBackorder,
          });
          shippingForm.reset({
            isDigital: product.isDigital,
            requiresShipping: product.requiresShipping,
            weight: product.weight,
            length: product.length,
            width: product.width,
            height: product.height,
          });
          seoForm.reset({
            metaTitle: product.metaTitle || '',
            metaDescription: product.metaDescription || '',
            metaKeywords: product.metaKeywords || '',
          });
          if (product.attributes.length > 0) {
            attributesForm.reset({
              attributes: product.attributes.map((attr) => ({
                name: attr.name,
                value: attr.value,
                type: attr.type,
                displayOrder: attr.displayOrder,
              })),
            });
          }
          if (product.variations.length > 0) {
            variationsForm.reset({
              variations: product.variations.map((variation) => ({
                name: variation.name,
                sku: variation.sku || '',
                price: variation.price,
                stockQuantity: variation.stockQuantity,
                weight: variation.weight,
                attributes: variation.attributes.map((attr) => ({
                  name: attr.name,
                  value: attr.value,
                })),
              })),
            });
          }
          setUploadedImages(product.images.map((img) => ({
            id: img.id,
            url: img.fileUrl,
            isPrimary: img.isPrimary,
          })));
        } catch (error) {
          toast.error('Failed to load product');
        }
      };
      loadProduct();
    }
  }, [productId]);

  const handleNext = async () => {
    let isValid = false;
    let stepData: any;

    if (currentStep === 1) {
      isValid = await basicInfoForm.trigger();
      if (isValid) {
        stepData = basicInfoForm.getValues();
        setFormData((prev) => ({ ...prev, basicInfo: stepData }));
      }
    } else if (currentStep === 2) {
      isValid = await pricingForm.trigger();
      if (isValid) {
        stepData = pricingForm.getValues();
        setFormData((prev) => ({ ...prev, pricing: stepData }));
      }
    } else if (currentStep === 3) {
      isValid = await shippingForm.trigger();
      if (isValid) {
        stepData = shippingForm.getValues();
        setFormData((prev) => ({ ...prev, shipping: stepData }));
      }
    } else if (currentStep === 4) {
      isValid = await seoForm.trigger();
      if (isValid) {
        stepData = seoForm.getValues();
        setFormData((prev) => ({ ...prev, seo: stepData }));
      }
    } else if (currentStep === 5) {
      // Images step - no validation required, can skip
      isValid = true;
    } else if (currentStep === 6) {
      // Attributes step - optional, can skip
      isValid = true;
    } else if (currentStep === 7) {
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    setImages((prev) => [...prev, ...imageFiles]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const setPrimaryImage = (index: number) => {
    setUploadedImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === index }))
    );
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const basicInfo = basicInfoForm.getValues();
      const pricing = pricingForm.getValues();
      const shipping = shippingForm.getValues();
      const seo = seoForm.getValues();
      const attributes = attributesForm.getValues().attributes;
      const variations = variationsForm.getValues().variations;

      const productData = {
        ...basicInfo,
        ...pricing,
        ...shipping,
        ...seo,
        categoryId: basicInfo.categoryId || undefined,
        attributes: attributes.map((attr, index) => ({
          name: attr.name,
          value: attr.value,
          type: attr.type,
          displayOrder: attr.displayOrder || index,
        })) as ProductAttributeInput[],
        variations: variations.map((variation) => ({
          name: variation.name,
          sku: variation.sku || undefined,
          price: variation.price,
          stockQuantity: variation.stockQuantity,
          weight: variation.weight,
          attributes: variation.attributes.map((attr) => ({
            name: attr.name,
            value: attr.value,
          })),
        })) as ProductVariationInput[],
      };

      let product;
      if (productId) {
        product = await productApi.updateProduct(productId, productData);
      } else {
        product = await productApi.createProduct(productData);
      }

      // Upload images
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          try {
            await productApi.uploadProductImage({
              productId: product.id,
              file: image,
              displayOrder: uploadedImages.length + i,
              isPrimary: uploadedImages.length + i === 0 && uploadedImages.length === 0,
            });
          } catch (error) {
            console.error(`Failed to upload image ${i + 1}:`, error);
          }
        }
      }

      toast.success(productId ? 'Product updated successfully' : 'Product created successfully');
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/vendor/products`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const flattenCategories = (cats: Category[]): { value: string; label: string }[] => {
    const result: { value: string; label: string }[] = [];
    const traverse = (category: Category, prefix = '') => {
      const label = prefix ? `${prefix} > ${category.name}` : category.name;
      result.push({ value: category.id, label });
      if (category.children) {
        category.children.forEach((child) => traverse(child, label));
      }
    };
    cats.forEach((cat) => traverse(cat));
    return result;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep > step.id
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : currentStep === step.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-gray-300 text-gray-400'
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </div>
                <div className="mt-2 text-xs font-medium text-center max-w-[100px]">
                  {step.title}
                </div>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
          <p className="text-sm text-gray-600">{STEPS[currentStep - 1].description}</p>
        </CardHeader>
        <CardContent>
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Input
                  {...basicInfoForm.register('name')}
                  label="Product Name *"
                  error={basicInfoForm.formState.errors.name?.message}
                  placeholder="Enter product name"
                  maxLength={200}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {basicInfoForm.watch('name')?.length || 0} / 200 characters
                </p>
              </div>
              <div>
                <Textarea
                  {...basicInfoForm.register('shortDescription')}
                  label="Short Description"
                  error={basicInfoForm.formState.errors.shortDescription?.message}
                  placeholder="Brief product summary (shown in product listings)"
                  rows={3}
                  maxLength={500}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {basicInfoForm.watch('shortDescription')?.length || 0} / 500 characters
                </p>
              </div>
              <div>
                <Textarea
                  {...basicInfoForm.register('description')}
                  label="Full Description"
                  error={basicInfoForm.formState.errors.description?.message}
                  placeholder="Detailed product description"
                  rows={6}
                  maxLength={5000}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {basicInfoForm.watch('description')?.length || 0} / 5000 characters
                </p>
              </div>
              <Select
                {...basicInfoForm.register('categoryId')}
                label="Category"
                error={basicInfoForm.formState.errors.categoryId?.message}
                options={[
                  { value: '', label: 'Select a category (optional)' },
                  ...flattenCategories(categories),
                ]}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    {...basicInfoForm.register('sku')}
                    label="SKU"
                    error={basicInfoForm.formState.errors.sku?.message}
                    placeholder="Product SKU"
                  />
                  <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" />
                    Stock Keeping Unit (optional)
                  </p>
                </div>
                <div>
                  <Input
                    {...basicInfoForm.register('barcode')}
                    label="Barcode"
                    error={basicInfoForm.formState.errors.barcode?.message}
                    placeholder="Product barcode"
                  />
                  <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" />
                    UPC/EAN barcode (optional)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Pricing & Inventory */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Input
                  {...pricingForm.register('price', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  label="Price"
                  error={pricingForm.formState.errors.price?.message}
                  placeholder="0.00"
                />
                <Input
                  {...pricingForm.register('compareAtPrice', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  label="Compare At Price"
                  error={pricingForm.formState.errors.compareAtPrice?.message}
                  placeholder="0.00"
                />
                <Input
                  {...pricingForm.register('costPrice', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  label="Cost Price"
                  error={pricingForm.formState.errors.costPrice?.message}
                  placeholder="0.00"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  {...pricingForm.register('stockQuantity', { valueAsNumber: true })}
                  type="number"
                  label="Stock Quantity"
                  error={pricingForm.formState.errors.stockQuantity?.message}
                  placeholder="0"
                />
                <Input
                  {...pricingForm.register('lowStockThreshold', { valueAsNumber: true })}
                  type="number"
                  label="Low Stock Threshold"
                  error={pricingForm.formState.errors.lowStockThreshold?.message}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Checkbox
                  checked={pricingForm.watch('trackInventory')}
                  onChange={(e) => pricingForm.setValue('trackInventory', e.target.checked)}
                  label="Track Inventory"
                />
                <p className="text-xs text-gray-500 ml-6">
                  Automatically update stock when orders are placed
                </p>
                {pricingForm.watch('trackInventory') && (
                  <>
                    <Checkbox
                      checked={pricingForm.watch('allowBackorder')}
                      onChange={(e) => pricingForm.setValue('allowBackorder', e.target.checked)}
                      label="Allow Backorder"
                    />
                    {pricingForm.watch('allowBackorder') && (
                      <p className="text-xs text-gray-500 ml-6">
                        Allow customers to purchase when out of stock
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Shipping & Physical */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <Checkbox
                  checked={shippingForm.watch('isDigital')}
                  onChange={(e) => {
                    shippingForm.setValue('isDigital', e.target.checked);
                    if (e.target.checked) {
                      shippingForm.setValue('requiresShipping', false);
                    }
                  }}
                  label="This is a digital product (downloadable)"
                />
                <p className="text-xs text-gray-500 ml-6">
                  Digital products don't require shipping
                </p>
                {!shippingForm.watch('isDigital') && (
                  <>
                    <Checkbox
                      checked={shippingForm.watch('requiresShipping')}
                      onChange={(e) => shippingForm.setValue('requiresShipping', e.target.checked)}
                      label="Requires Shipping"
                    />
                    <p className="text-xs text-gray-500 ml-6">
                      Physical products need shipping information
                    </p>
                  </>
                )}
              </div>
              {shippingForm.watch('requiresShipping') && !shippingForm.watch('isDigital') && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 mb-3">
                    Shipping Dimensions
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Input
                      {...shippingForm.register('weight', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      label="Weight (kg) *"
                      error={shippingForm.formState.errors.weight?.message}
                      placeholder="0.00"
                    />
                    <Input
                      {...shippingForm.register('length', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      label="Length (cm)"
                      error={shippingForm.formState.errors.length?.message}
                      placeholder="0.00"
                    />
                    <Input
                      {...shippingForm.register('width', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      label="Width (cm)"
                      error={shippingForm.formState.errors.width?.message}
                      placeholder="0.00"
                    />
                    <Input
                      {...shippingForm.register('height', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      label="Height (cm)"
                      error={shippingForm.formState.errors.height?.message}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: SEO & Metadata */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Tip:</strong> SEO fields are optional. If left empty, we'll use your product name and description.
                </p>
              </div>
              <div>
                <Input
                  {...seoForm.register('metaTitle')}
                  label="Meta Title"
                  error={seoForm.formState.errors.metaTitle?.message}
                  placeholder="SEO title for search engines"
                  maxLength={200}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {seoForm.watch('metaTitle')?.length || 0} / 200 characters
                </p>
              </div>
              <div>
                <Textarea
                  {...seoForm.register('metaDescription')}
                  label="Meta Description"
                  error={seoForm.formState.errors.metaDescription?.message}
                  placeholder="Brief description for search results"
                  rows={3}
                  maxLength={500}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {seoForm.watch('metaDescription')?.length || 0} / 500 characters
                </p>
              </div>
              <div>
                <Input
                  {...seoForm.register('metaKeywords')}
                  label="Meta Keywords"
                  error={seoForm.formState.errors.metaKeywords?.message}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separate keywords with commas
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Images & Media */}
          {currentStep === 5 && (
            <div className="space-y-6">
              {/* Uploaded Images */}
              {uploadedImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Uploaded Images</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {uploadedImages.map((img, index) => (
                      <div key={img.id} className="relative group">
                        <img
                          src={img.url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        {img.isPrimary && (
                          <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                            Primary
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(index)}
                          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center text-white text-sm"
                        >
                          {!img.isPrimary && 'Set as Primary'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </span>
                  </label>
                </div>
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Attributes */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Add product specifications like material, brand, warranty, etc.
                </p>
              </div>
              {attributesForm.watch('attributes').length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">No attributes added yet</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => attributesForm.setValue('attributes', [
                      ...attributesForm.getValues('attributes'),
                      { name: '', value: '', type: AttributeType.TEXT, displayOrder: attributesForm.getValues('attributes').length }
                    ])}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Attribute
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {attributesForm.watch('attributes').map((attr, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-12 gap-4 items-start">
                        <div className="col-span-4">
                          <Input
                            {...attributesForm.register(`attributes.${index}.name`)}
                            placeholder="Attribute name (e.g., Material)"
                            label="Name"
                          />
                        </div>
                        <div className="col-span-5">
                          <Input
                            {...attributesForm.register(`attributes.${index}.value`)}
                            placeholder="Attribute value (e.g., Cotton)"
                            label="Value"
                          />
                        </div>
                        <div className="col-span-2">
                          <Select
                            {...attributesForm.register(`attributes.${index}.type`)}
                            label="Type"
                            options={[
                              { value: AttributeType.TEXT, label: 'Text' },
                              { value: AttributeType.NUMBER, label: 'Number' },
                              { value: AttributeType.BOOLEAN, label: 'Boolean' },
                            ]}
                          />
                        </div>
                        <div className="col-span-1 flex items-end">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const attrs = attributesForm.getValues('attributes');
                              attrs.splice(index, 1);
                              attributesForm.setValue('attributes', attrs);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => attributesForm.setValue('attributes', [
                      ...attributesForm.getValues('attributes'),
                      { name: '', value: '', type: AttributeType.TEXT, displayOrder: attributesForm.getValues('attributes').length }
                    ])}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Attribute
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 7: Variations */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Add variations like different sizes, colors, or styles. Each variation can have its own price and stock.
                </p>
              </div>
              {variationsForm.watch('variations').length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-4">No variations added yet</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => variationsForm.setValue('variations', [
                      ...variationsForm.getValues('variations'),
                      {
                        name: '',
                        sku: '',
                        price: 0,
                        stockQuantity: 0,
                        weight: 0,
                        attributes: []
                      }
                    ])}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Variation
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {variationsForm.watch('variations').map((variation, index) => (
                    <Card key={index} className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Variation {index + 1}</h3>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const vars = variationsForm.getValues('variations');
                            vars.splice(index, 1);
                            variationsForm.setValue('variations', vars);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <Input
                          {...variationsForm.register(`variations.${index}.name`)}
                          label="Variation Name *"
                          placeholder="e.g., Small - Red"
                        />
                        <Input
                          {...variationsForm.register(`variations.${index}.sku`)}
                          label="SKU"
                          placeholder="Optional SKU"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <Input
                          {...variationsForm.register(`variations.${index}.price`, { valueAsNumber: true })}
                          type="number"
                          step="0.01"
                          label="Price *"
                          placeholder="0.00"
                        />
                        <Input
                          {...variationsForm.register(`variations.${index}.stockQuantity`, { valueAsNumber: true })}
                          type="number"
                          label="Stock Quantity *"
                          placeholder="0"
                        />
                        <Input
                          {...variationsForm.register(`variations.${index}.weight`, { valueAsNumber: true })}
                          type="number"
                          step="0.01"
                          label="Weight (kg)"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Variation Attributes</label>
                        {variation.attributes?.map((attr, attrIndex) => (
                          <div key={attrIndex} className="flex gap-2">
                            <Input
                              {...variationsForm.register(`variations.${index}.attributes.${attrIndex}.name`)}
                              placeholder="Attribute (e.g., Size)"
                              className="flex-1"
                            />
                            <Input
                              {...variationsForm.register(`variations.${index}.attributes.${attrIndex}.value`)}
                              placeholder="Value (e.g., Small)"
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const attrs = variationsForm.getValues(`variations.${index}.attributes`);
                                attrs.splice(attrIndex, 1);
                                variationsForm.setValue(`variations.${index}.attributes`, attrs);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const attrs = variationsForm.getValues(`variations.${index}.attributes`) || [];
                            variationsForm.setValue(`variations.${index}.attributes`, [
                              ...attrs,
                              { name: '', value: '' }
                            ]);
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Attribute
                        </Button>
                      </div>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => variationsForm.setValue('variations', [
                      ...variationsForm.getValues('variations'),
                      {
                        name: '',
                        sku: '',
                        price: 0,
                        stockQuantity: 0,
                        weight: 0,
                        attributes: []
                      }
                    ])}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Variation
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              {currentStep < STEPS.length && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    // Save as draft
                    try {
                      const basicInfo = basicInfoForm.getValues();
                      const pricing = pricingForm.getValues();
                      const shipping = shippingForm.getValues();
                      const seo = seoForm.getValues();
                      const attributes = attributesForm.getValues().attributes;
                      const variations = variationsForm.getValues().variations;

                      const productData = {
                        ...basicInfo,
                        ...pricing,
                        ...shipping,
                        ...seo,
                        status: 'Draft' as const,
                        categoryId: basicInfo.categoryId || undefined,
                        attributes: attributes.map((attr, index) => ({
                          name: attr.name,
                          value: attr.value,
                          type: attr.type,
                          displayOrder: attr.displayOrder || index,
                        })) as ProductAttributeInput[],
                        variations: variations.map((variation) => ({
                          name: variation.name,
                          sku: variation.sku || undefined,
                          price: variation.price,
                          stockQuantity: variation.stockQuantity,
                          weight: variation.weight,
                          attributes: variation.attributes.map((attr) => ({
                            name: attr.name,
                            value: attr.value,
                          })),
                        })) as ProductVariationInput[],
                      };

                      if (productId) {
                        await productApi.updateProduct(productId, productData);
                      } else {
                        await productApi.createProduct(productData);
                      }
                      toast.success('Draft saved successfully');
                    } catch (error: any) {
                      toast.error(error.message || 'Failed to save draft');
                    }
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
              )}
            </div>
            <Button
              type="button"
              onClick={handleNext}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {currentStep === STEPS.length ? 'Publish Product' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

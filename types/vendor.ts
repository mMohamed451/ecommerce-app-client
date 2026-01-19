// Vendor-related types

export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  businessDescription?: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress?: VendorAddress;
  taxId?: string;
  registrationNumber?: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  verificationStatus: VerificationStatus;
  verificationDocuments?: VerificationDocument[];
  rating: number;
  totalReviews: number;
  totalSales: number;
  totalProducts: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum VerificationStatus {
  PENDING = 'Pending',
  UNDER_REVIEW = 'UnderReview',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  SUSPENDED = 'Suspended',
}

export interface VerificationDocument {
  id: string;
  type: DocumentType;
  url: string;
  uploadedAt: string;
  status: DocumentStatus;
  rejectionReason?: string;
}

export enum DocumentType {
  BUSINESS_LICENSE = 'BusinessLicense',
  TAX_CERTIFICATE = 'TaxCertificate',
  IDENTITY_PROOF = 'IdentityProof',
  BANK_STATEMENT = 'BankStatement',
  OTHER = 'Other',
}

export enum DocumentStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface VendorAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface VendorRegistrationRequest {
  // Step 1: Business Information
  businessName: string;
  businessDescription?: string;
  businessEmail: string;
  businessPhone: string;
  website?: string;
  
  // Step 2: Business Address
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Step 3: Legal Information
  taxId?: string;
  registrationNumber?: string;
  
  // Step 4: Documents
  documents: File[];
}

export interface VendorProfileUpdate {
  businessName?: string;
  businessDescription?: string;
  businessEmail?: string;
  businessPhone?: string;
  website?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
  registrationNumber?: string;
}

export interface VendorAnalytics {
  totalSales: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalProducts: number;
  activeProducts: number;
  totalViews: number;
  conversionRate: number;
  salesByPeriod: SalesByPeriod[];
  topProducts: TopProduct[];
}

export interface SalesByPeriod {
  period: string; // e.g., "2024-01", "Jan 2024"
  sales: number;
  orders: number;
  revenue: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  sales: number;
  revenue: number;
  views: number;
}

export interface VendorRating {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment?: string;
  createdAt: string;
  helpfulCount: number;
  isVerifiedPurchase: boolean;
}

export interface VendorReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    five: number;
    four: number;
    three: number;
    two: number;
    one: number;
  };
}

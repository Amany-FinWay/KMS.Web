export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

export interface CategoryDto {
  id: number;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  icon: string;
  active: boolean;
  createdAt: string;
}

export interface CreateCategoryDto {
  nameEn: string;
  nameAr: string;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  icon: string;
}

export interface UpdateCategoryDto {
  id: number;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  icon: string;
  active: boolean;
}

export interface CategoryFilterDto {
  search: string | null;
  active: boolean | null;
  pagination: {
    pageNumber: number;
    pageSize: number;
  };
}

export interface ProductDto {
  id: number;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  categoryId: number;
  categoryNameEn: string;
  categoryNameAr: string;
  categoryIcon: string;
  price: number;
  sku: string;
  barcode: string;
  posBankCharge: number;
  taxRate: number;
  weightInGrams: number;
  active: boolean;
  imageUrl?: string | null;
}

export interface ProductFilterDto {
  search: string | null;
  categoryId: number | null;
  active: boolean | null;
  pagination: {
    pageNumber: number;
    pageSize: number;
  };
}

export interface ChangeProductStatusDto {
  id: number;
  active: boolean;
}

// Kiosks Line (Vending Machines) Models
export interface VendingMachineDto {
  kioskId: number;
  code: string;
  name: string;
  location?: string | null;
  lines: KioskLineViewDto[];
  alerts: KioskLineAlertDto[];
}

export interface KioskLineDto {
  lineNumber: number;
  productId: number | null;
  currentStock: number;
  maxStock: number;
  threshold: number;
  replQty: number;
  active: boolean;
}

export interface SaveKioskLinesDto {
  kioskId: number;
  lines: KioskLineDto[];
}

export interface KioskLineViewDto {
  lineNumber: number;
  lineCode: string;
  productId: number | null;
  productNameEn?: string | null;
  productNameAr?: string | null;
  currentStock: number;
  maxStock: number;
  threshold: number;
  replQty: number;
  active: boolean;
}

export interface KioskLineAlertDto {
  lineNumber: number;
  lineCode: string;
  productName: string;
  currentStock: number;
  threshold: number;
}
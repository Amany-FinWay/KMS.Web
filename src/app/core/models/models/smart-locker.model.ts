export interface SmartLockerListItemDto {
  kioskId: number;
  code: string;
  serial: string;
  name: string;
  location?: string | null;
  totalCompartments: number;
  emptyCompartments: number;
  assignedCompartments: number;
  deliveredCompartments: number;
  occupancyRate: number;
}

export interface SmartLockerCompartmentDto {
  id: number;
  compartmentNumber: string;
  compartmentCode: string;
  size: string;
  status: string;
  productId?: number | null;
  productName?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  assignedAt?: string | null;
  deliveredAt?: string | null;
}

export interface SmartLockerDetailsDto {
  kioskId: number;
  code: string;
  serial: string;
  name: string;
  location?: string | null;
  totalCompartments: number;
  emptyCompartments: number;
  assignedCompartments: number;
  deliveredCompartments: number;
  occupancyRate: number;
  compartments: SmartLockerCompartmentDto[];
}
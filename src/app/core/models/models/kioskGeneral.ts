export interface PagedResult<T> {
  items: T[];
  totalCount: number;
}

export interface KioskDto {
  id: number;
  code: string;
  serial: string;
  name: string;
  description?: string | null;
  kioskType: number;
  active: boolean;
  isOnline: boolean;
  availableInvoicePaper: number;
  cashLevelPercentage: number;
  location: string;
  latitude: string;
  longitude: string;
  ip?: string | null;
  clientUrl?: string | null;
  softwareVersion?: string | null;
  currentTemperature?: number | null;
  lastPingAt?: string | null;
  lastServiceAt?: string | null;
  nextServiceAt?: string | null;
}

export interface KioskFilterDto {
  search?: string | null;
  active?: boolean | null;
  isOnline?: boolean | null;
  kioskType?: number | null;
  pagination: {
    pageNumber: number;
    pageSize: number;
  };
}
import { KioskStatus } from '../_enums/map-view.enums';

export interface KioskMapItem {
  id: number;
  code: string;
  name: string;
  location: string;
  status: KioskStatus;
  transactions: number;
  revenue: number;
  x: number;
  y: number;
  isActive: boolean;
  lat: number;
  lng: number;
}

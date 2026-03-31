import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { KioskStatus } from '../../core/models/_enums/map-view.enums';
import { KioskMapItem } from '../../core/models/models/map-view.model';

import { InteractiveMapCanvasComponent } from './components/interactive-map-canvas/interactive-map-canvas.component';
import { KioskLocationsSidebarComponent } from './components/kiosk-locations-sidebar/kiosk-locations-sidebar.component';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [
    CommonModule,
    KioskLocationsSidebarComponent,
    InteractiveMapCanvasComponent,
  ],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css',
})
export class MapViewComponent {
  readonly kiosks = signal<KioskMapItem[]>([
    {
      id: 1,
      code: 'K001',
      name: 'Terminal 1 - Main Entrance',
      location: 'Airport Terminal 1',
      status: KioskStatus.Online,
      transactions: 342,
      revenue: 15681,
      x: 29,
      y: 21,
      isActive: true,
      lat: 30.11231,
      lng: 31.40192,
    },
    {
      id: 2,
      code: 'K002',
      name: 'Terminal 2 - Gate Area',
      location: 'Airport Terminal 2',
      status: KioskStatus.Maintenance,
      transactions: 289,
      revenue: 12341,
      x: 43,
      y: 32,
      isActive: true,
      lat: 30.11382,
      lng: 31.40631,
    },
    {
      id: 3,
      code: 'K003',
      name: 'Downtown Station',
      location: 'Central Station',
      status: KioskStatus.Error,
      transactions: 156,
      revenue: 6890,
      x: 71,
      y: 56,
      isActive: false,
      lat: 30.04412,
      lng: 31.23571,
    },
    {
      id: 4,
      code: 'K004',
      name: 'Shopping Mall - Level 1',
      location: 'Westfield Mall',
      status: KioskStatus.Online,
      transactions: 418,
      revenue: 18120,
      x: 86,
      y: 68,
      isActive: true,
      lat: 30.07152,
      lng: 31.34888,
    },
    {
      id: 5,
      code: 'K005',
      name: 'Business District Hub',
      location: 'Financial Center',
      status: KioskStatus.Online,
      transactions: 267,
      revenue: 11024,
      x: 58,
      y: 44,
      isActive: true,
      lat: 30.06322,
      lng: 31.22744,
    },
    {
      id: 6,
      code: 'K006',
      name: 'North Gate Pickup',
      location: 'Industrial Zone',
      status: KioskStatus.Offline,
      transactions: 97,
      revenue: 3520,
      x: 15,
      y: 10,
      isActive: false,
      lat: 30.15461,
      lng: 31.50322,
    },
  ]);

  readonly searchTerm = signal('');
  readonly statusFilter = signal<'all' | KioskStatus>('all');
  readonly selectedKioskId = signal(1);

  readonly filteredKiosks = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();

    return this.kiosks().filter((kiosk) => {
      const matchesStatus = status === 'all' || kiosk.status === status;
      const matchesSearch =
        !query ||
        kiosk.code.toLowerCase().includes(query) ||
        kiosk.name.toLowerCase().includes(query) ||
        kiosk.location.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  });

  readonly selectedKiosk = computed(
    () =>
      this.filteredKiosks().find((item) => item.id === this.selectedKioskId()) ??
      this.filteredKiosks()[0] ??
      null,
  );

  readonly selectedSidebarKioskId = computed(() => this.selectedKiosk()?.id ?? null);

  readonly statusCounts = computed(() => ({
    online: this.kiosks().filter((item) => item.status === KioskStatus.Online).length,
    maintenance: this.kiosks().filter((item) => item.status === KioskStatus.Maintenance).length,
    error: this.kiosks().filter((item) => item.status === KioskStatus.Error).length,
    offline: this.kiosks().filter((item) => item.status === KioskStatus.Offline).length,
  }));

  setSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  setStatusFilter(value: 'all' | KioskStatus): void {
    this.statusFilter.set(value);
  }

  selectKiosk(id: number): void {
    this.selectedKioskId.set(id);
  }
}

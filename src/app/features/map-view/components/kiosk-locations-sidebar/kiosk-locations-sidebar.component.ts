import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Filter, LucideAngularModule, Monitor, Search } from 'lucide-angular';
import { KioskStatus } from '../../../../core/models/_enums/map-view.enums';
import { KioskMapItem } from '../../../../core/models/models/map-view.model';

@Component({
  selector: 'app-kiosk-locations-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './kiosk-locations-sidebar.component.html',
  styleUrl: './kiosk-locations-sidebar.component.css',
})
export class KioskLocationsSidebarComponent {
  @Input() kiosks: KioskMapItem[] = [];
  @Input() selectedKioskId: number | null = null;
  @Input() searchTerm = '';
  @Input() statusFilter: 'all' | KioskStatus = 'all';

  @Output() searchTermChange = new EventEmitter<string>();
  @Output() statusFilterChange = new EventEmitter<'all' | KioskStatus>();
  @Output() kioskSelected = new EventEmitter<number>();

  readonly icons = {
    Search,
    Filter,
    Monitor,
  };

  readonly statusOptions: Array<{ label: string; value: 'all' | KioskStatus }> = [
    { label: 'All Status', value: 'all' },
    { label: 'Online', value: KioskStatus.Online },
    { label: 'Offline', value: KioskStatus.Offline },
    { label: 'Maintenance', value: KioskStatus.Maintenance },
    { label: 'Error', value: KioskStatus.Error },
  ];

  setSearchTerm(value: string): void {
    this.searchTermChange.emit(value);
  }

  setStatusFilter(value: 'all' | KioskStatus): void {
    this.statusFilterChange.emit(value);
  }

  selectKiosk(id: number): void {
    this.kioskSelected.emit(id);
  }

  getStatusDotClass(status: KioskStatus): string {
    switch (status) {
      case KioskStatus.Online:
        return 'bg-[#10B981]';
      case KioskStatus.Maintenance:
        return 'bg-[#F59E0B]';
      case KioskStatus.Error:
        return 'bg-[#EF4444]';
      default:
        return 'bg-[#667085]';
    }
  }
}

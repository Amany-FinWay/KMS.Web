import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  LucideAngularModule,
  Minus,
  Plus,
  Send,
  TriangleAlert,
  Wifi,
  Wrench,
  XCircle,
} from 'lucide-angular';
import { KioskStatus } from '../../../../core/models/_enums/map-view.enums';
import { KioskMapItem } from '../../../../core/models/models/map-view.model';

@Component({
  selector: 'app-interactive-map-canvas',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './interactive-map-canvas.component.html',
  styleUrl: './interactive-map-canvas.component.css',
})
export class InteractiveMapCanvasComponent {
  readonly kioskStatus = KioskStatus;

  @Input() kiosks: KioskMapItem[] = [];
  @Input() selectedKiosk: KioskMapItem | null = null;
  @Input() statusCounts: { online: number; maintenance: number; error: number; offline: number } = {
    online: 0,
    maintenance: 0,
    error: 0,
    offline: 0,
  };
  @Output() kioskSelected = new EventEmitter<number>();

  readonly icons = {
    Plus,
    Minus,
    Send,
    Wifi,
    Wrench,
    XCircle,
    TriangleAlert,
  };

  selectKiosk(id: number): void {
    this.kioskSelected.emit(id);
  }

  getMarkerColorClass(status: KioskStatus): string {
    switch (status) {
      case KioskStatus.Online:
        return 'bg-[#12B981]';
      case KioskStatus.Maintenance:
        return 'bg-[#F59E0B]';
      case KioskStatus.Error:
        return 'bg-[#EF4444]';
      default:
        return 'bg-[#6B7280]';
    }
  }

  getStatusLabel(status: KioskStatus): string {
    switch (status) {
      case KioskStatus.Online:
        return 'Active';
      case KioskStatus.Maintenance:
        return 'Maintenance';
      case KioskStatus.Error:
        return 'Error';
      default:
        return 'Offline';
    }
  }

  getStatusIcon(status: KioskStatus) {
    switch (status) {
      case KioskStatus.Online:
        return this.icons.Wifi;
      case KioskStatus.Maintenance:
        return this.icons.Wrench;
      case KioskStatus.Error:
        return this.icons.TriangleAlert;
      default:
        return this.icons.XCircle;
    }
  }
}

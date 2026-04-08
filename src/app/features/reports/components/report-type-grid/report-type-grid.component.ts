import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Gauge,
  LucideAngularModule,
  TrendingUp,
  Wrench,
} from 'lucide-angular';

import { ReportCategory } from '../../../../core/models/_enums/reports.enums';
import { ReportTypeCardDto } from '../../../../core/models/models/reports.model';

@Component({
  selector: 'app-report-type-grid',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './report-type-grid.component.html',
  styleUrl: './report-type-grid.component.css',
})
export class ReportTypeGridComponent {
  @Input() items: ReportTypeCardDto[] = [];
  @Input() selectedReportId: string | null = null;
  @Output() reportSelected = new EventEmitter<string>();

  readonly icons = {
    financial: CircleDollarSign,
    document: FileText,
    performance: TrendingUp,
    downtime: Activity,
    error: AlertTriangle,
    maintenance: Wrench,
    inventory: BarChart3,
    analytics: Gauge,
    comparison: TrendingUp,
    summary: ClipboardList,
  };

  readonly reportCategory = ReportCategory;

  getCategoryClass(category: ReportCategory): string {
    switch (category) {
      case ReportCategory.Financial:
        return 'bg-[#DCFCE7] text-[#047857]';
      case ReportCategory.Operational:
        return 'bg-[#DBEAFE] text-[#1D4ED8]';
      case ReportCategory.Maintenance:
        return 'bg-[#FFEDD5] text-[#C2410C]';
      default:
        return 'bg-[#F3E8FF] text-[#7E22CE]';
    }
  }

  selectReport(id: string): void {
    this.reportSelected.emit(id);
  }
}

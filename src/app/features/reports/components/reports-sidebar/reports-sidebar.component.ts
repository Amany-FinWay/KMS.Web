import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Download, FileSpreadsheet, FileText, LucideAngularModule } from 'lucide-angular';

import { ReportExportOptionDto, ReportTypeCardDto, ReportsQuickStatsDto, ScheduledReportDto } from '../../../../core/models/models/reports.model';

@Component({
  selector: 'app-reports-sidebar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './reports-sidebar.component.html',
  styleUrl: './reports-sidebar.component.css',
})
export class ReportsSidebarComponent {
  @Input() selectedReport: ReportTypeCardDto | null = null;
  @Input() exportOptions: ReportExportOptionDto[] = [];
  @Input() quickStats: ReportsQuickStatsDto | null = null;
  @Input() scheduledReports: ScheduledReportDto[] = [];

  readonly icons = {
    FileText,
    FileSpreadsheet,
    Download,
  };

  getExportOptionClass(format: ReportExportOptionDto['format']): string {
    switch (format) {
      case 'pdf':
        return 'bg-[#FEF2F2] text-[#DC2626]';
      case 'excel':
        return 'bg-[#ECFDF3] text-[#16A34A]';
      default:
        return 'bg-[#EFF6FF] text-[#2563EB]';
    }
  }

  getExportIcon(format: ReportExportOptionDto['format']) {
    switch (format) {
      case 'excel':
        return this.icons.FileSpreadsheet;
      default:
        return this.icons.FileText;
    }
  }
}

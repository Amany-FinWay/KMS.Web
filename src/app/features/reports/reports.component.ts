import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FileText, Filter, LucideAngularModule } from 'lucide-angular';

import { ReportCategory } from '../../core/models/_enums/reports.enums';
import { ReportExportOptionDto, ReportPreviewDto, ReportsQuickStatsDto, ReportTypeCardDto, ScheduledReportDto } from '../../core/models/models/reports.model';
import { ReportPreviewComponent } from './components/report-preview/report-preview.component';
import { ReportTypeGridComponent } from './components/report-type-grid/report-type-grid.component';
import { ReportsSidebarComponent } from './components/reports-sidebar/reports-sidebar.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ReportTypeGridComponent, ReportsSidebarComponent, ReportPreviewComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent {
  readonly icons = {
    FileText,
    Filter,
  };

  readonly reportTypes: ReportTypeCardDto[] = [
    {
      id: 'revenue-summary',
      title: 'Revenue Summary Report',
      description: 'Comprehensive overview of revenue across all kiosks with trends and comparisons',
      category: ReportCategory.Financial,
      icon: 'financial',
    },
    {
      id: 'transaction-detail',
      title: 'Transaction Detail Report',
      description: 'Detailed breakdown of all transactions including payment methods and statuses',
      category: ReportCategory.Financial,
      icon: 'document',
    },
    {
      id: 'kiosk-performance',
      title: 'Kiosk Performance Report',
      description: 'Uptime, transaction volume, and efficiency metrics for each kiosk',
      category: ReportCategory.Operational,
      icon: 'performance',
    },
    {
      id: 'downtime-analysis',
      title: 'Downtime Analysis Report',
      description: 'Analysis of kiosk outages, causes, and resolution times',
      category: ReportCategory.Operational,
      icon: 'downtime',
    },
    {
      id: 'error-log',
      title: 'Error Log Report',
      description: 'Complete log of errors and issues across all kiosks with severity levels',
      category: ReportCategory.Operational,
      icon: 'error',
    },
    {
      id: 'maintenance-schedule',
      title: 'Maintenance Schedule Report',
      description: 'Scheduled and completed maintenance activities with cost breakdown',
      category: ReportCategory.Maintenance,
      icon: 'maintenance',
    },
    {
      id: 'inventory-status',
      title: 'Inventory Status Report',
      description: 'Paper levels, cash reserves, and supply status across all locations',
      category: ReportCategory.Maintenance,
      icon: 'inventory',
    },
    {
      id: 'usage-analytics',
      title: 'Usage Analytics Report',
      description: 'Peak usage times, customer behavior patterns, and service type preferences',
      category: ReportCategory.Analytics,
      icon: 'analytics',
    },
    {
      id: 'comparative-analysis',
      title: 'Comparative Analysis Report',
      description: 'Location-by-location comparison of all key performance indicators',
      category: ReportCategory.Analytics,
      icon: 'comparison',
    },
    {
      id: 'executive-summary',
      title: 'Executive Summary Report',
      description: 'High-level overview of all operations for management review',
      category: ReportCategory.Analytics,
      icon: 'summary',
    },
  ];

  readonly selectedReportId = signal<string | null>('transaction-detail');

  readonly selectedReport = computed(
    () => this.reportTypes.find((item) => item.id === this.selectedReportId()) ?? null,
  );

  readonly exportOptions: ReportExportOptionDto[] = [
    { id: 'pdf', label: 'Export as PDF', format: 'pdf' },
    { id: 'excel', label: 'Export as Excel', format: 'excel' },
    { id: 'word', label: 'Export as Word', format: 'word' },
  ];

  readonly preview: ReportPreviewDto = {
    rangeText: '3/2/2026 - 4/1/2026',
    generatedAtText: '4/1/2026',
  };

  readonly quickStats: ReportsQuickStatsDto = {
    reportsGenerated: 247,
    thisMonth: 18,
    lastReport: '2 hours ago',
  };

  readonly scheduledReports: ScheduledReportDto[] = [
    {
      id: 'weekly-revenue',
      title: 'Weekly Revenue Summary',
      schedule: 'Every Monday at 9:00 AM',
    },
    {
      id: 'monthly-performance',
      title: 'Monthly Performance',
      schedule: '1st of each month',
    },
  ];

  selectReport(id: string): void {
    this.selectedReportId.set(id);
  }
}

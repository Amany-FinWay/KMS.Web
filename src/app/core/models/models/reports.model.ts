import { ReportCategory } from '../_enums/reports.enums';

export interface ReportTypeCardDto {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  icon: 'financial' | 'document' | 'performance' | 'downtime' | 'error' | 'maintenance' | 'inventory' | 'analytics' | 'comparison' | 'summary';
}

export interface ReportExportOptionDto {
  id: string;
  label: string;
  format: 'pdf' | 'excel' | 'word';
}

export interface ScheduledReportDto {
  id: string;
  title: string;
  schedule: string;
}

export interface ReportsQuickStatsDto {
  reportsGenerated: number;
  thisMonth: number;
  lastReport: string;
}

export interface ReportPreviewDto {
  rangeText: string;
  generatedAtText: string;
}

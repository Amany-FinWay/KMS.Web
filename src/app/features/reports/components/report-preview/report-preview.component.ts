import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CalendarDays, FileText, LucideAngularModule } from 'lucide-angular';

import { ReportPreviewDto, ReportTypeCardDto } from '../../../../core/models/models/reports.model';

@Component({
  selector: 'app-report-preview',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './report-preview.component.html',
  styleUrl: './report-preview.component.css',
})
export class ReportPreviewComponent {
  @Input() selectedReport: ReportTypeCardDto | null = null;
  @Input() preview: ReportPreviewDto | null = null;

  readonly icons = {
    CalendarDays,
    FileText,
  };
}

import { CommonModule } from '@angular/common';
import { Component, Input, computed, signal } from '@angular/core';

import { TransactionStatusChartDto } from '../../../../core/models/models/transaction.model';

interface StatusSegment {
  status: string;
  count: number;
  percentage: number;
  color: string;
  labelColor: string;
}

@Component({
  selector: 'app-transaction-status-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-status-chart.component.html',
  styleUrl: './transaction-status-chart.component.css',
})
export class TransactionStatusChartComponent {
  @Input() set items(value: TransactionStatusChartDto[] | null) {
    this._items.set(value ?? []);
  }

  private _items = signal<TransactionStatusChartDto[]>([]);

  readonly segments = computed<StatusSegment[]>(() =>
    this._items().map((item) => ({
      ...item,
      color: this.getStatusColor(item.status),
      labelColor: this.getStatusColor(item.status),
    })),
  );

  readonly pieBackground = computed(() => {
    const segments = this.segments();
    if (!segments.length) {
      return 'conic-gradient(#E5E7EB 0deg 360deg)';
    }

    let current = 0;
    const stops = segments.map((segment) => {
      const start = current;
      const end = current + (segment.percentage / 100) * 360;
      current = end;
      return `${segment.color} ${start}deg ${end}deg`;
    });

    return `conic-gradient(${stops.join(', ')})`;
  });

  private getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#10B981';
      case 'failed':
        return '#EF4444';
      case 'refunded':
        return '#F59E0B';
      default:
        return '#94A3B8';
    }
  }
}

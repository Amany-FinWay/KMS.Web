import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input, computed, signal } from '@angular/core';

import { RevenueByTransactionTypeDto } from '../../../../core/models/models/transaction.model';

@Component({
  selector: 'app-revenue-type-chart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './revenue-type-chart.component.html',
  styleUrl: './revenue-type-chart.component.css',
})
export class RevenueTypeChartComponent {
  @Input() set items(value: RevenueByTransactionTypeDto[] | null) {
    this._items.set(value ?? []);
  }

  private _items = signal<RevenueByTransactionTypeDto[]>([]);

  readonly maxRevenue = computed(() =>
    Math.max(...this._items().map((item) => item.revenue), 0),
  );

  readonly chartItems = computed(() =>
    this._items().map((item) => ({
      ...item,
      height: this.maxRevenue() > 0 ? Math.max((item.revenue / this.maxRevenue()) * 100, 18) : 0,
    })),
  );

  readonly axisValues = computed(() => {
    const max = this.maxRevenue();
    if (max <= 0) {
      return [0, 25, 50, 75, 100];
    }

    return [4, 3, 2, 1, 0].map((step) => Math.round((max / 4) * step));
  });
}

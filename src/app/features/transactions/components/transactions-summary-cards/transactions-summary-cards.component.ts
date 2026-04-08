import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  CircleDollarSign,
  LucideAngularModule,
  ReceiptText,
  TrendingUp,
  Users,
} from 'lucide-angular';

import { DashboardSummaryDto } from '../../../../core/models/models/transaction.model';

@Component({
  selector: 'app-transactions-summary-cards',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CurrencyPipe],
  templateUrl: './transactions-summary-cards.component.html',
  styleUrl: './transactions-summary-cards.component.css',
})
export class TransactionsSummaryCardsComponent {
  @Input() summary: DashboardSummaryDto | null = null;

  readonly icons = {
    CircleDollarSign,
    ReceiptText,
    TrendingUp,
    Users,
  };
}

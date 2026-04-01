import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Download,
  Filter,
  LucideAngularModule,
  Mail,
  Phone,
  Search,
  UserRound,
} from 'lucide-angular';

import { TransactionStatus } from '../../../../core/models/_enums/transaction.enums';
import { CustomerListItemDto, TransactionListItemDto } from '../../../../core/models/models/transaction.model';

type TransactionsTabType = 'transactions' | 'customers';

@Component({
  selector: 'app-transactions-data-panel',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CurrencyPipe, DatePipe],
  templateUrl: './transactions-data-panel.component.html',
  styleUrl: './transactions-data-panel.component.css',
})
export class TransactionsDataPanelComponent {
  @Input() activeTab: TransactionsTabType = 'transactions';
  @Input() searchTerm = '';
  @Input() statusFilter: TransactionStatus | 'all' = 'all';
  @Input() transactions: TransactionListItemDto[] = [];
  @Input() customers: CustomerListItemDto[] = [];

  @Output() activeTabChange = new EventEmitter<TransactionsTabType>();
  @Output() searchTermChange = new EventEmitter<string>();
  @Output() statusFilterChange = new EventEmitter<TransactionStatus | 'all'>();
  @Output() exportRequested = new EventEmitter<TransactionsTabType>();

  readonly transactionStatus = TransactionStatus;

  readonly icons = {
    Search,
    Filter,
    Download,
    UserRound,
    Mail,
    Phone,
  };

  readonly statusOptions: Array<{ label: string; value: TransactionStatus | 'all' }> = [
    { label: 'All Status', value: 'all' },
    { label: 'Pending', value: TransactionStatus.Pending },
    { label: 'Completed', value: TransactionStatus.Completed },
    { label: 'Failed', value: TransactionStatus.Failed },
    { label: 'Refunded', value: TransactionStatus.Refunded },
  ];

  setTab(tab: TransactionsTabType): void {
    this.activeTabChange.emit(tab);
  }

  setSearch(value: string): void {
    this.searchTermChange.emit(value);
  }

  setStatusFilter(value: string): void {
    this.statusFilterChange.emit(value === 'all' ? 'all' : Number(value) as TransactionStatus);
  }

  export(): void {
    this.exportRequested.emit(this.activeTab);
  }

  getTransactionStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-[#DCFCE7] text-[#15803D]';
      case 'failed':
        return 'bg-[#FEE2E2] text-[#DC2626]';
      case 'refunded':
        return 'bg-[#FEF3C7] text-[#D97706]';
      default:
        return 'bg-[#E0E7FF] text-[#4338CA]';
    }
  }
}

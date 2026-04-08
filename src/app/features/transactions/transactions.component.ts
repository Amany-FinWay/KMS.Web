import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { LucideAngularModule, CircleDollarSign } from 'lucide-angular';

import { SpinnerToasterService } from '../../core/services/spinner-toaster.service';
import { TransactionsService } from '../../core/services/transactions.service';
import { TransactionStatus } from '../../core/models/_enums/transaction.enums';
import {
  CustomerListItemDto,
  DashboardFilterDto,
  DashboardPageDto,
  RevenueByTransactionTypeDto,
  TransactionListItemDto,
  TransactionStatusChartDto,
} from '../../core/models/models/transaction.model';
import { RevenueTypeChartComponent } from './components/revenue-type-chart/revenue-type-chart.component';
import { TransactionStatusChartComponent } from './components/transaction-status-chart/transaction-status-chart.component';
import { TransactionsDataPanelComponent } from './components/transactions-data-panel/transactions-data-panel.component';
import { TransactionsSummaryCardsComponent } from './components/transactions-summary-cards/transactions-summary-cards.component';

type TransactionsTabType = 'transactions' | 'customers';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    TransactionsSummaryCardsComponent,
    RevenueTypeChartComponent,
    TransactionStatusChartComponent,
    TransactionsDataPanelComponent,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  private transactionsService = inject(TransactionsService);
  private spinnerToasterService = inject(SpinnerToasterService);

  readonly icons = {
    CircleDollarSign,
  };

  readonly transactionStatus = TransactionStatus;

  loading = signal(false);
  activeTab = signal<TransactionsTabType>('transactions');
  searchTerm = signal('');
  statusFilter = signal<TransactionStatus | 'all'>('all');

  dashboardData = signal<DashboardPageDto | null>(null);

  readonly summary = computed(() => this.dashboardData()?.summary ?? null);
  readonly revenueByType = computed<RevenueByTransactionTypeDto[]>(
    () => this.dashboardData()?.revenueByTransactionType ?? [],
  );
  readonly statusChart = computed<TransactionStatusChartDto[]>(
    () => this.dashboardData()?.transactionStatusChart ?? [],
  );
  readonly transactions = computed<TransactionListItemDto[]>(
    () => this.dashboardData()?.transactions.items ?? [],
  );
  readonly customers = computed<CustomerListItemDto[]>(
    () => this.dashboardData()?.customers.items ?? [],
  );

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    const currentStatus = this.statusFilter();
    const filter: DashboardFilterDto = {
      search: this.searchTerm().trim() || null,
      transactionStatus: currentStatus === 'all' ? null : currentStatus,
      transactionsPagination: { pageNumber: 1, pageSize: 50 },
      customersPagination: { pageNumber: 1, pageSize: 50 },
    };

    this.loading.set(true);

    this.transactionsService.getDashboardData(filter).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res?.status && res.data) {
          this.dashboardData.set(res.data);
        } else {
          this.dashboardData.set(null);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.dashboardData.set(null);
        console.error(err);
        this.spinnerToasterService.showToaster(
          'error',
          err?.error?.message || 'Failed to load transactions dashboard',
        );
      },
    });
  }

  setActiveTab(tab: TransactionsTabType): void {
    this.activeTab.set(tab);
  }

  setSearchTerm(value: string): void {
    this.searchTerm.set(value);
    this.loadDashboard();
  }

  setStatusFilter(value: TransactionStatus | 'all'): void {
    this.statusFilter.set(value);
    this.loadDashboard();
  }

  exportCsv(tab: TransactionsTabType): void {
    if (tab === 'transactions') {
      const rows = this.transactions().map((item) => ({
        transactionNumber: item.transactionNumber,
        kioskName: item.kioskName,
        customerName: item.customerName,
        type: item.type,
        amount: item.amount,
        paymentMethod: item.paymentMethod,
        status: item.status,
        date: item.date,
      }));
      this.downloadCsv('transactions-export.csv', rows);
      return;
    }

    const rows = this.customers().map((item) => ({
      fullName: item.fullName,
      email: item.email,
      phoneNumber: item.phoneNumber,
      active: item.active,
      totalSpent: item.totalSpent,
      transactionsCount: item.transactionsCount,
      lastTransactionDate: item.lastTransactionDate ?? '',
    }));
    this.downloadCsv('customers-export.csv', rows);
  }

  private downloadCsv(fileName: string, rows: Record<string, unknown>[]): void {
    if (!rows.length) {
      this.spinnerToasterService.showToaster('error', 'No data available to export');
      return;
    }

    const headers = Object.keys(rows[0]);
    const csvRows = [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((header) => `"${String(row[header] ?? '').replace(/"/g, '""')}"`)
          .join(','),
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}

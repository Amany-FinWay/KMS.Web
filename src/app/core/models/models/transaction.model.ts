import { ApiResponse } from './deployment.model';
import { PagedResult } from './kioskGeneral';
import { TransactionStatus } from '../_enums/transaction.enums';

export interface PaginationRequest {
  pageNumber: number;
  pageSize: number;
}

export interface DashboardFilterDto {
  search?: string | null;
  transactionStatus?: TransactionStatus | null;
  transactionsPagination: PaginationRequest;
  customersPagination: PaginationRequest;
}

export interface DashboardSummaryDto {
  totalRevenue: number;
  totalTransactions: number;
  successRate: number;
  totalCustomers: number;
}

export interface RevenueByTransactionTypeDto {
  type: string;
  revenue: number;
}

export interface TransactionStatusChartDto {
  status: string;
  count: number;
  percentage: number;
}

export interface TransactionListItemDto {
  id: number;
  transactionNumber: string;
  kioskName: string;
  customerName: string;
  type: string;
  amount: number;
  paymentMethod: string;
  status: string;
  date: string;
}

export interface CustomerListItemDto {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  active: boolean;
  totalSpent: number;
  transactionsCount: number;
  lastTransactionDate?: string | null;
}

export interface DashboardPageDto {
  summary: DashboardSummaryDto;
  revenueByTransactionType: RevenueByTransactionTypeDto[];
  transactionStatusChart: TransactionStatusChartDto[];
  transactions: PagedResult<TransactionListItemDto>;
  customers: PagedResult<CustomerListItemDto>;
}

export type TransactionsDashboardResponse = ApiResponse<DashboardPageDto>;

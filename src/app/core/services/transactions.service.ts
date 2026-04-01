import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { TransactionsDashboardResponse, DashboardFilterDto } from '../models/models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private http = inject(HttpClient);
  private base = '/api/TransactionsTab';

  getDashboardData(filter: DashboardFilterDto): Observable<TransactionsDashboardResponse> {
    return this.http.post<TransactionsDashboardResponse>(
      `${this.base}/get-data-for-transaction-tab`,
      filter,
    );
  }
}

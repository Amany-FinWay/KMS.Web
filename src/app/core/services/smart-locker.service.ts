import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/models/deployment.model';
import {
  SmartLockerListItemDto,
  SmartLockerDetailsDto,
} from '../models/models/smart-locker.model';

@Injectable({
  providedIn: 'root',
})
export class SmartLockerService {
  private http = inject(HttpClient);
  private base = '/api/SmartLocker';

  getAllSmartLockers(): Observable<ApiResponse<SmartLockerListItemDto[]>> {
    return this.http.post<ApiResponse<SmartLockerListItemDto[]>>(
      `${this.base}/get-all-smart-locker`,
      {}
    );
  }

getSmartLockerById(kioskId: number): Observable<ApiResponse<SmartLockerDetailsDto>> {
  return this.http.options<ApiResponse<SmartLockerDetailsDto>>(
    `${this.base}/get-smartt-locker-coms-${kioskId}`
  );
}

  downloadEmptyCompartmentsCsv(kioskId: number): void {
    this.http
      .get(`${this.base}/downlaod-smart-locker-template-${kioskId}?emptyTemplate=true`, {
        responseType: 'blob',
      })
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `smart-locker-template-${kioskId}.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Download template failed:', err);
        },
      });
  }

  uploadCompartmentsCsv(kioskId: number, file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ApiResponse<string>>(
      `${this.base}/upload-smart-locker-data-${kioskId}`,
      formData
    );
  }
}
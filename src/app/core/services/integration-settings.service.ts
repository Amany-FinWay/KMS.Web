import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IntegrationSettingsPageDto, StatusResponse } from '../models/models/integrations-settings.model';


@Injectable({
  providedIn: 'root'
})
export class IntegrationSettingsService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/IntegrationSettings`;

  getSettings(): Observable<StatusResponse<IntegrationSettingsPageDto>> {
    return this.http.post<StatusResponse<IntegrationSettingsPageDto>>(
      `${this.baseUrl}/get-intgrations`,
      {}
    );
  }

  saveSettings(dto: IntegrationSettingsPageDto): Observable<StatusResponse<any>> {
    return this.http.post<StatusResponse<any>>(
      `${this.baseUrl}/save`,
      dto
    );
  }
}
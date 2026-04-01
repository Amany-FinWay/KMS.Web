import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  MediaContentDetailsResponse,
  MediaContentFilterDto,
  MediaContentStatsResponse,
  MediaLibraryResponse,
  UpdateMediaContentDto,
} from '../models/models/digital-signage.model';
import { StatusResponse } from '../models/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class DigitalSignageService {
  private http = inject(HttpClient);
  private base = '/api/MediaContent';
  private filesBase = '/api/Files';
  private mediaRootPath = 'C:\\kms\\media';
  private silentRequestHeaders = new HttpHeaders({ 'X-Skip-Spinner': 'true' });

  getMediaLibrary(filter: MediaContentFilterDto): Observable<MediaLibraryResponse> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber)
      .set('pageSize', filter.pageSize);

    if (filter.search) {
      params = params.set('search', filter.search);
    }

    if (filter.contentType !== null && filter.contentType !== undefined) {
      params = params.set('contentType', filter.contentType);
    }

    if (filter.tag) {
      params = params.set('tag', filter.tag);
    }

    if (filter.isActive !== null && filter.isActive !== undefined) {
      params = params.set('isActive', filter.isActive);
    }

    return this.http.post<MediaLibraryResponse>(`${this.base}/get-all`, {}, {
      params,
      headers: this.silentRequestHeaders,
    });
  }

  getMediaContentById(id: number): Observable<MediaContentDetailsResponse> {
    return this.http.post<MediaContentDetailsResponse>(`${this.base}/get-by-id-${id}`, {}, {
      headers: this.silentRequestHeaders,
    });
  }

  getMediaContentStats(): Observable<MediaContentStatsResponse> {
    return this.http.post<MediaContentStatsResponse>(`${this.base}/get-header-stats`, {}, {
      headers: this.silentRequestHeaders,
    });
  }

  createMediaContent(formData: FormData): Observable<StatusResponse<any>> {
    return this.http.post<StatusResponse<any>>(`${this.base}/upload-media`, formData);
  }

  updateMediaContent(id: number, dto: UpdateMediaContentDto): Observable<StatusResponse<any>> {
    return this.http.post<StatusResponse<any>>(`${this.base}/edit-media-data-${id}`, dto);
  }

  deleteMediaContent(id: number): Observable<StatusResponse<any>> {
    return this.http.post<StatusResponse<any>>(`${this.base}/delete-media-${id}`, {});
  }

  resolveMediaUrl(path?: string | null): string {
    if (!path) {
      return '';
    }

    if (/^https?:\/\//i.test(path) || path.startsWith('/')) {
      return path;
    }

    return `/media/${path.replace(/^\/+/, '')}`;
  }

  getMediaDownloadUrl(path?: string | null): string {
    const absolutePath = this.getAbsoluteMediaPath(path);

    if (!absolutePath) {
      return '';
    }

    return `${this.filesBase}/download?path=${encodeURIComponent(absolutePath)}`;
  }

  getMediaFileBlob(path: string): Observable<Blob> {
    return this.http.get(this.getMediaDownloadUrl(path), {
      headers: this.silentRequestHeaders,
      responseType: 'blob',
    });
  }

  downloadMediaFile(path: string, fileName: string): void {
    const url = this.getMediaDownloadUrl(path);

    if (!url) {
      return;
    }

    this.http.get(url, {
      headers: this.silentRequestHeaders,
      responseType: 'blob',
    }).subscribe({
      next: (blob) => {
        const objectUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = objectUrl;
        anchor.download = fileName || 'media-file';
        anchor.click();
        window.URL.revokeObjectURL(objectUrl);
      },
      error: (err) => {
        console.error('Failed to download media file', err);
      },
    });
  }

  openMediaFile(path: string): void {
    this.getMediaFileBlob(path).subscribe({
      next: (blob) => {
        const objectUrl = window.URL.createObjectURL(blob);
        window.open(objectUrl, '_blank', 'noopener,noreferrer');
        setTimeout(() => window.URL.revokeObjectURL(objectUrl), 60000);
      },
      error: (err) => {
        console.error('Failed to open media file', err);
      },
    });
  }

  private getAbsoluteMediaPath(path?: string | null): string {
    if (!path) {
      return '';
    }

    const normalizedPath = path.replace(/\//g, '\\').replace(/^\\+/, '');

    if (/^[a-z]:\\/i.test(normalizedPath)) {
      return normalizedPath;
    }

    return `${this.mediaRootPath}\\${normalizedPath}`;
  }
}

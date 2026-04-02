import { MediaContentType } from '../_enums/digital-signage.enums';
import { StatusResponse } from './user.model';

export interface MediaContentFilterDto {
  search?: string | null;
  contentType?: MediaContentType | null;
  tag?: string | null;
  isActive?: boolean | null;
  pageNumber: number;
  pageSize: number;
}

export interface MediaContentListItemDto {
  id: number;
  title: string;
  contentType: MediaContentType;
  contentTypeName: string;
  fileUrl: string;
  thumbnailUrl?: string | null;
  thumbnailPath?: string | null;
  fileSizeInBytes: number;
  fileSizeFormatted: string;
  durationInSeconds?: number | null;
  durationFormatted?: string | null;
  tags: string[];
  isActive: boolean;
  createdAt: string;
}

export interface MediaContentDetailsDto extends MediaContentListItemDto {
  description?: string | null;
  fileName: string;
  originalFileName: string;
  extension: string;
  mimeType: string;
  thumbnailPath?: string | null;
  width?: number | null;
  height?: number | null;
  updatedAt?: string | null;
  createdBy?: number | null;
  updatedBy?: number | null;
}

export interface MediaContentStatsDto {
  totalFiles: number;
  imagesCount: number;
  videosCount: number;
  documentsCount: number;
}

export interface MediaLibraryResponseDto {
  items: MediaContentListItemDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface UpdateMediaContentDto {
  title: string;
  description?: string | null;
  tags?: string[] | null;
  durationInSeconds?: number | null;
  isActive: boolean;
}

export interface CreateMediaContentFormValue {
  title: string;
  description: string;
  tags: string;
  selectedFileType: string;
  thumbnailFile: File | null;
  durationInSeconds?: number | null;
  file: File | null;
}

export type MediaLibraryResponse = StatusResponse<MediaLibraryResponseDto>;
export type MediaContentDetailsResponse = StatusResponse<MediaContentDetailsDto>;
export type MediaContentStatsResponse = StatusResponse<MediaContentStatsDto>;

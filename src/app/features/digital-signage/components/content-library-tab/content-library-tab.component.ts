import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Download,
  Eye,
  FileText,
  Filter,
  Image,
  LucideAngularModule,
  Monitor,
  Search,
  Trash2,
  Upload,
  Video,
} from 'lucide-angular';

import { MediaContentType, MediaLibraryFilterType } from '../../../../core/models/_enums/digital-signage.enums';
import { MediaContentDetailsDto, MediaContentListItemDto, MediaContentStatsDto } from '../../../../core/models/models/digital-signage.model';
import { DigitalSignageService } from '../../../../core/services/digital-signage.service';
import { SpinnerToasterService } from '../../../../core/services/spinner-toaster.service';
import { MediaPreviewModalComponent } from './components/media-preview-modal/media-preview-modal.component';
import { MediaUploadModalComponent } from './components/media-upload-modal/media-upload-modal.component';

@Component({
  selector: 'app-content-library-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, MediaUploadModalComponent, MediaPreviewModalComponent],
  templateUrl: './content-library-tab.component.html',
  styleUrl: './content-library-tab.component.css',
})
export class ContentLibraryTabComponent implements OnInit {
  private digitalSignageService = inject(DigitalSignageService);
  private spinnerToasterService = inject(SpinnerToasterService);

  readonly icons = {
    FileText,
    Image,
    Video,
    Monitor,
    Search,
    Filter,
    Upload,
    Eye,
    Download,
    Trash2,
  };

  readonly filterOptions: { value: MediaLibraryFilterType; label: string }[] = [
    { value: 'all', label: 'All Types' },
    { value: 'images', label: 'Images' },
    { value: 'videos', label: 'Videos' },
    { value: 'pdf', label: 'PDF' },
    { value: 'powerpoint', label: 'PowerPoint' },
  ];

  loadingStats = signal(false);
  deletingId = signal<number | null>(null);
  searchTerm = signal('');
  selectedType = signal<MediaLibraryFilterType>('all');
  isTypeMenuOpen = signal(false);
  isUploadModalOpen = signal(false);
  isPreviewModalOpen = signal(false);
  mediaItems = signal<MediaContentListItemDto[]>([]);
  stats = signal<MediaContentStatsDto>({
    totalFiles: 0,
    imagesCount: 0,
    videosCount: 0,
    documentsCount: 0,
  });
  selectedMediaDetails = signal<MediaContentDetailsDto | null>(null);
  totalCount = signal(0);
  pageNumber = signal(1);
  readonly pageSize = 12;
  private searchDebounceId: ReturnType<typeof setTimeout> | null = null;

  readonly filteredItems = computed(() =>
    this.mediaItems().filter((item) => this.matchesSelectedType(item)),
  );

  readonly visibleCountText = computed(() => {
    const total = this.totalCount();
    const visible = this.filteredItems().length;

    if (!total) {
      return 'No content found';
    }

    return `Showing ${visible} of ${total} items`;
  });

  ngOnInit(): void {
    this.loadHeaderStats();
    this.loadMediaLibrary();
  }

  @HostListener('document:click')
  closeTypeMenu(): void {
    this.isTypeMenuOpen.set(false);
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.pageNumber.set(1);

    if (this.searchDebounceId) {
      clearTimeout(this.searchDebounceId);
    }

    this.searchDebounceId = setTimeout(() => {
      this.loadMediaLibrary();
    }, 350);
  }

  toggleTypeMenu(event: Event): void {
    event.stopPropagation();
    this.isTypeMenuOpen.update((value) => !value);
  }

  setType(type: MediaLibraryFilterType): void {
    this.selectedType.set(type);
    this.isTypeMenuOpen.set(false);
    this.pageNumber.set(1);
    this.loadMediaLibrary();
  }

  getSelectedFilterLabel(): string {
    return (
      this.filterOptions.find((option) => option.value === this.selectedType())?.label ??
      'All Types'
    );
  }

  openUploadModal(): void {
    this.isUploadModalOpen.set(true);
  }

  closeUploadModal(): void {
    this.isUploadModalOpen.set(false);
  }

  onMediaUploaded(): void {
    this.closeUploadModal();
    this.loadHeaderStats();
    this.loadMediaLibrary();
  }

  openPreview(item: MediaContentListItemDto): void {
    this.digitalSignageService.getMediaContentById(item.id).subscribe({
      next: (res) => {
        if (res?.status && res.data) {
          this.selectedMediaDetails.set(res.data);
          this.isPreviewModalOpen.set(true);
        } else {
          this.spinnerToasterService.showToaster('error', res?.message || 'Failed to load media details');
        }
      },
      error: (err) => {
        console.error(err);
        this.spinnerToasterService.showToaster('error', err?.error?.message || 'Failed to load media details');
      },
    });
  }

  closePreviewModal(): void {
    this.isPreviewModalOpen.set(false);
    this.selectedMediaDetails.set(null);
  }

  downloadMedia(item: MediaContentListItemDto): void {
    if (!item.fileUrl) {
      this.spinnerToasterService.showToaster('error', 'File path is missing');
      return;
    }

    this.digitalSignageService.downloadMediaFile(
      item.fileUrl,
      this.getDownloadFileName(item),
    );
  }

  shouldShowDuration(item: MediaContentListItemDto): boolean {
    return Number(item.contentType) === MediaContentType.Video;
  }

  deleteMedia(item: MediaContentListItemDto): void {
    if (!window.confirm(`Delete "${item.title}"?`)) {
      return;
    }

    this.deletingId.set(item.id);

    this.digitalSignageService.deleteMediaContent(item.id).subscribe({
      next: (res) => {
        this.deletingId.set(null);

        if (res?.status) {
          this.spinnerToasterService.showToaster('success', res.message || 'Media deleted successfully');
          this.loadHeaderStats();
          this.loadMediaLibrary();
        } else {
          this.spinnerToasterService.showToaster('error', res?.message || 'Failed to delete media');
        }
      },
      error: (err) => {
        this.deletingId.set(null);
        console.error(err);
        this.spinnerToasterService.showToaster('error', err?.error?.message || 'Failed to delete media');
      },
    });
  }

  loadMediaLibrary(): void {
    this.digitalSignageService.getMediaLibrary({
      search: this.searchTerm().trim() || null,
      contentType: this.getApiContentType(this.selectedType()),
      tag: null,
      isActive: true,
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize,
    }).subscribe({
      next: (res) => {
        if (res?.status && res.data) {
          this.mediaItems.set(res.data.items ?? []);
          this.totalCount.set(res.data.totalCount ?? 0);
        } else {
          this.mediaItems.set([]);
          this.totalCount.set(0);
        }
      },
      error: (err) => {
        this.mediaItems.set([]);
        this.totalCount.set(0);
        console.error(err);
        this.spinnerToasterService.showToaster('error', err?.error?.message || 'Failed to load media library');
      },
    });
  }

  loadHeaderStats(): void {
    this.loadingStats.set(true);

    this.digitalSignageService.getMediaContentStats().subscribe({
      next: (res) => {
        this.loadingStats.set(false);

        if (res?.status && res.data) {
          this.stats.set(res.data);
        }
      },
      error: () => {
        this.loadingStats.set(false);
      },
    });
  }

  getCardTypeLabel(item: MediaContentListItemDto): string {
    const subtype = this.getSubtype(item);

    if (subtype === 'pdf') {
      return 'PDF';
    }

    if (subtype === 'powerpoint') {
      return 'PPTX';
    }

    if (Number(item.contentType) === MediaContentType.Image) {
      return 'IMAGE';
    }

    if (Number(item.contentType) === MediaContentType.Video) {
      return 'VIDEO';
    }

    return 'DOC';
  }

  getCardTypeClass(item: MediaContentListItemDto): string {
    const subtype = this.getSubtype(item);

    if (subtype === 'pdf') {
      return 'bg-[#FFF1F2] text-[#FF0000]';
    }

    if (subtype === 'powerpoint') {
      return 'bg-[#FFF2E8] text-[#FF6A00]';
    }

    if (Number(item.contentType) === MediaContentType.Image) {
      return 'bg-[#F3E8FF] text-[#8B2CF5]';
    }

    return 'bg-[#EAF2FF] text-[#1D63FF]';
  }

  getCardTypeIcon(item: MediaContentListItemDto): any {
    const subtype = this.getSubtype(item);

    if (subtype === 'pdf') {
      return this.icons.FileText;
    }

    if (subtype === 'powerpoint') {
      return this.icons.Monitor;
    }

    if (Number(item.contentType) === MediaContentType.Image) {
      return this.icons.Image;
    }

    if (Number(item.contentType) === MediaContentType.Video) {
      return this.icons.Video;
    }

    return this.icons.FileText;
  }

  getPreviewImageUrl(item: MediaContentListItemDto): string {
    return this.resolveMediaUrl(item.thumbnailUrl || item.fileUrl);
  }

  hasVisualPreview(item: MediaContentListItemDto): boolean {
    return !!this.getPreviewImageUrl(item) && this.getSubtype(item) !== 'pdf' && this.getSubtype(item) !== 'powerpoint';
  }

  resolveMediaUrl(path?: string | null): string {
    return this.digitalSignageService.resolveMediaUrl(path);
  }

  private getApiContentType(type: MediaLibraryFilterType): MediaContentType | null {
    if (type === 'images') {
      return MediaContentType.Image;
    }

    if (type === 'videos') {
      return MediaContentType.Video;
    }

    if (type === 'pdf' || type === 'powerpoint') {
      return MediaContentType.Document;
    }

    return null;
  }

  private matchesSelectedType(item: MediaContentListItemDto): boolean {
    const selectedType = this.selectedType();

    if (selectedType === 'all') {
      return true;
    }

    if (selectedType === 'images') {
      return Number(item.contentType) === MediaContentType.Image;
    }

    if (selectedType === 'videos') {
      return Number(item.contentType) === MediaContentType.Video;
    }

    return this.getSubtype(item) === selectedType;
  }

  private getSubtype(item: MediaContentListItemDto): 'pdf' | 'powerpoint' | 'other' {
    const path = (item.fileUrl || '').toLowerCase();

    if (path.endsWith('.pdf')) {
      return 'pdf';
    }

    if (path.endsWith('.ppt') || path.endsWith('.pptx')) {
      return 'powerpoint';
    }

    return 'other';
  }

  private getDownloadFileName(item: MediaContentListItemDto): string {
    const path = item.fileUrl || '';
    const extension = path.includes('.') ? path.slice(path.lastIndexOf('.')) : '';
    const baseName = item.title
      .trim()
      .replace(/[<>:"/\\|?*]+/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();

    return `${baseName || 'media-file'}${extension}`;
  }
}

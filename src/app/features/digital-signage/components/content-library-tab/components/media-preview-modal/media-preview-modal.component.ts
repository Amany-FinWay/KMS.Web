import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Download, ExternalLink, FileText, LucideAngularModule, X } from 'lucide-angular';
import { Subscription } from 'rxjs';

import { MediaContentType } from '../../../../../../core/models/_enums/digital-signage.enums';
import { MediaContentDetailsDto } from '../../../../../../core/models/models/digital-signage.model';
import { DigitalSignageService } from '../../../../../../core/services/digital-signage.service';

@Component({
  selector: 'app-media-preview-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './media-preview-modal.component.html',
  styleUrl: './media-preview-modal.component.css',
})
export class MediaPreviewModalComponent implements OnChanges, OnDestroy {
  private digitalSignageService = inject(DigitalSignageService);
  private sanitizer = inject(DomSanitizer);
  private previewSubscription: Subscription | null = null;

  @Input({ required: true }) media!: MediaContentDetailsDto | null;
  @Output() close = new EventEmitter<void>();

  readonly icons = {
    X,
    Download,
    ExternalLink,
    FileText,
  };

  previewObjectUrl = signal<string>('');
  previewResourceUrl = signal<SafeResourceUrl | null>(null);

  isImage(): boolean {
    return Number(this.media?.contentType) === MediaContentType.Image;
  }

  isVideo(): boolean {
    return Number(this.media?.contentType) === MediaContentType.Video;
  }

  shouldShowDuration(): boolean {
    return this.isVideo();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['media']) {
      this.loadPreviewBlob();
    }
  }

  ngOnDestroy(): void {
    this.previewSubscription?.unsubscribe();
    this.revokePreviewObjectUrl();
  }

  openFile(): void {
    if (this.media?.fileUrl) {
      this.digitalSignageService.openMediaFile(this.media.fileUrl);
    }
  }

  downloadFile(): void {
    if (this.media?.fileUrl) {
      this.digitalSignageService.downloadMediaFile(
        this.media.fileUrl,
        this.media.originalFileName || this.media.title,
      );
    }
  }

  private loadPreviewBlob(): void {
    this.previewSubscription?.unsubscribe();
    this.revokePreviewObjectUrl();

    if (!this.media?.fileUrl) {
      return;
    }

    this.previewSubscription = this.digitalSignageService
      .getMediaFileBlob(this.media.fileUrl)
      .subscribe({
        next: (blob) => {
          const objectUrl = window.URL.createObjectURL(blob);
          this.previewObjectUrl.set(objectUrl);
          this.previewResourceUrl.set(
            this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl),
          );
        },
        error: (err) => {
          console.error('Failed to load preview file', err);
          this.previewObjectUrl.set('');
          this.previewResourceUrl.set(null);
        },
      });
  }

  private revokePreviewObjectUrl(): void {
    const currentUrl = this.previewObjectUrl();

    if (currentUrl) {
      window.URL.revokeObjectURL(currentUrl);
      this.previewObjectUrl.set('');
      this.previewResourceUrl.set(null);
    }
  }
}

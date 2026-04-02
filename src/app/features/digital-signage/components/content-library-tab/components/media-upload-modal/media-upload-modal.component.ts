import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Upload, X } from 'lucide-angular';

import { CreateMediaContentFormValue } from '../../../../../../core/models/models/digital-signage.model';
import { DigitalSignageService } from '../../../../../../core/services/digital-signage.service';
import { SpinnerToasterService } from '../../../../../../core/services/spinner-toaster.service';

@Component({
  selector: 'app-media-upload-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './media-upload-modal.component.html',
  styleUrl: './media-upload-modal.component.css',
})
export class MediaUploadModalComponent implements OnDestroy {
  private digitalSignageService = inject(DigitalSignageService);
  private spinnerToasterService = inject(SpinnerToasterService);

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  readonly icons = {
    Upload,
    X,
  };

  readonly fileTypeOptions = [
    { value: 'image', label: 'Images', accept: '.jpg,.jpeg,.png,.gif,.webp,.bmp' },
    { value: 'video', label: 'Videos', accept: '.mp4,.avi,.mov,.wmv,.mkv,.webm' },
    { value: 'pdf', label: 'PDF', accept: '.pdf' },
    { value: 'powerpoint', label: 'PowerPoint', accept: '.ppt,.pptx' },
    { value: 'document', label: 'Documents', accept: '.doc,.docx,.xls,.xlsx,.txt' },
  ] as const;

  saving = signal(false);
  thumbnailPreviewUrl = signal<string>('');
  form = signal<CreateMediaContentFormValue>({
    title: '',
    description: '',
    tags: '',
    selectedFileType: 'image',
    thumbnailFile: null,
    durationInSeconds: null,
    file: null,
  });

  ngOnDestroy(): void {
    this.revokeThumbnailPreview();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (file && !this.matchesSelectedType(file.name)) {
      this.spinnerToasterService.showToaster(
        'error',
        `Selected file does not match "${this.getSelectedFileTypeLabel()}"`,
      );

      this.form.update((value) => ({
        ...value,
        file: null,
      }));

      input.value = '';
      return;
    }

    this.form.update((value) => ({
      ...value,
      file,
    }));
  }

  onThumbnailSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const thumbnailFile = input.files?.[0] ?? null;

    if (thumbnailFile && !this.isImageFile(thumbnailFile.name)) {
      this.spinnerToasterService.showToaster(
        'error',
        'Poster must be an image file',
      );
      input.value = '';
      return;
    }

    this.revokeThumbnailPreview();

    if (thumbnailFile) {
      this.thumbnailPreviewUrl.set(window.URL.createObjectURL(thumbnailFile));
    }

    this.form.update((value) => ({
      ...value,
      thumbnailFile,
    }));
  }

  updateField<K extends keyof CreateMediaContentFormValue>(
    key: K,
    value: CreateMediaContentFormValue[K],
  ): void {
    this.form.update((current) => ({
      ...current,
      [key]: value,
    }));
  }

  onFileTypeChange(value: string): void {
    this.form.update((current) => ({
      ...current,
      selectedFileType: value,
      file: null,
    }));
  }

  getSelectedAcceptValue(): string {
    return (
      this.fileTypeOptions.find((option) => option.value === this.form().selectedFileType)?.accept ??
      ''
    );
  }

  getSelectedFileTypeLabel(): string {
    return (
      this.fileTypeOptions.find((option) => option.value === this.form().selectedFileType)?.label ??
      'File'
    );
  }

  submit(): void {
    const value = this.form();

    if (!value.title.trim()) {
      this.spinnerToasterService.showToaster('error', 'Title is required');
      return;
    }

    if (!value.file) {
      this.spinnerToasterService.showToaster('error', 'Please choose a file');
      return;
    }

    const formData = new FormData();
    formData.append('title', value.title.trim());
    formData.append('description', value.description.trim());
    formData.append('file', value.file);
    formData.append('selectedFileType', value.selectedFileType);

    if (value.durationInSeconds) {
      formData.append('durationInSeconds', String(value.durationInSeconds));
    }

    if (value.thumbnailFile) {
      formData.append('thumbnail', value.thumbnailFile);
    }

    value.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .forEach((tag) => formData.append('tags', tag));

    this.saving.set(true);

    this.digitalSignageService.createMediaContent(formData).subscribe({
      next: (res) => {
        this.saving.set(false);

        if (res?.status) {
          this.spinnerToasterService.showToaster(
            'success',
            res.message || 'Media uploaded successfully',
          );
          this.saved.emit();
        } else {
          this.spinnerToasterService.showToaster(
            'error',
            res?.message || 'Failed to upload media',
          );
        }
      },
      error: (err) => {
        this.saving.set(false);
        console.error(err);
        this.spinnerToasterService.showToaster(
          'error',
          err?.error?.message || 'Failed to upload media',
        );
      },
    });
  }

  private matchesSelectedType(fileName: string): boolean {
    const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    const acceptedExtensions = this.getSelectedAcceptValue()
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);

    return acceptedExtensions.includes(extension);
  }

  private isImageFile(fileName: string): boolean {
    const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].includes(extension);
  }

  private revokeThumbnailPreview(): void {
    const currentPreview = this.thumbnailPreviewUrl();

    if (currentPreview) {
      window.URL.revokeObjectURL(currentPreview);
      this.thumbnailPreviewUrl.set('');
    }
  }
}

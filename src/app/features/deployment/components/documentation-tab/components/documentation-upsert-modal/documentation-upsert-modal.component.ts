import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, UploadCloud, FileText, Link2, Video, FileCode2 } from 'lucide-angular';

import { DeploymentService } from '../../../../../../core/services/deployment.service';
import { SpinnerToasterService } from '../../../../../../core/services/spinner-toaster.service';
import { DocumentationCategory, DocumentationResourceType } from '../../../../../../core/models/_enums/deployment.enums';

@Component({
  selector: 'app-documentation-upsert-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './documentation-upsert-modal.component.html',
  styleUrl: './documentation-upsert-modal.component.css',
})
export class DocumentationUpsertModalComponent {
  private deploymentService = inject(DeploymentService);
  private spinnerToasterService = inject(SpinnerToasterService);

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  readonly icons = {
    X,
    UploadCloud,
    FileText,
    Link2,
    Video,
    FileCode2,
  };

  readonly categoryOptions = [
    { value: DocumentationCategory.GettingStarted, label: 'Getting Started' },
    { value: DocumentationCategory.UserGuide, label: 'User Guide' },
    { value: DocumentationCategory.VideoTutorial, label: 'Video Tutorial' },
    { value: DocumentationCategory.AdditionalSupport, label: 'Additional Support' },
  ];

  readonly resourceTypeOptions = [
    { value: DocumentationResourceType.PdfDocument, label: 'PDF Document' },
    { value: DocumentationResourceType.VideoTutorial, label: 'Video Tutorial' },
    { value: DocumentationResourceType.ExternalLink, label: 'External Link' },
    { value: DocumentationResourceType.APIDocumenation, label: 'API Documentation' },
  ];

  saving = signal(false);

  form = signal({
    title: '',
    description: '',
    category: DocumentationCategory.GettingStarted,
    resourceType: DocumentationResourceType.PdfDocument,
    url: '',
    file: null as File | null,
    durationInMinutes: null as number | null,
    active: true,
  });

  isFileType = computed(() => {
    const type = Number(this.form().resourceType);
    return (
      type === DocumentationResourceType.PdfDocument ||
      type === DocumentationResourceType.VideoTutorial
    );
  });

  isLinkType = computed(() => {
    const type = Number(this.form().resourceType);
    return (
      type === DocumentationResourceType.ExternalLink ||
      type === DocumentationResourceType.APIDocumenation
    );
  });

  isVideoType = computed(() => {
    return Number(this.form().resourceType) === DocumentationResourceType.VideoTutorial;
  });

  updateForm(key: string, value: any): void {
    const numericFields = ['category', 'resourceType', 'durationInMinutes'];

    this.form.update((prev) => ({
      ...prev,
      [key]: numericFields.includes(key)
        ? (value === '' || value === null ? null : Number(value))
        : value,
    }));
  }

  onResourceTypeChange(value: any): void {
    const numericValue = Number(value);

    this.form.update((prev) => ({
      ...prev,
      resourceType: numericValue,
      url:
        numericValue === DocumentationResourceType.ExternalLink ||
        numericValue === DocumentationResourceType.APIDocumenation
          ? prev.url
          : '',
      file:
        numericValue === DocumentationResourceType.PdfDocument ||
        numericValue === DocumentationResourceType.VideoTutorial
          ? prev.file
          : null,
      durationInMinutes:
        numericValue === DocumentationResourceType.VideoTutorial
          ? prev.durationInMinutes
          : null,
    }));
  }

  onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.updateForm('file', null);
      return;
    }

    this.updateForm('file', file);
  }

  onSubmit(): void {
    const f = this.form();
    const type = Number(f.resourceType);

    if (!f.title.trim() || !f.description.trim()) {
      this.spinnerToasterService.showToaster('error', 'Title and description are required');
      return;
    }

    const isFileType =
      type === DocumentationResourceType.PdfDocument ||
      type === DocumentationResourceType.VideoTutorial;

    const isLinkType =
      type === DocumentationResourceType.ExternalLink ||
      type === DocumentationResourceType.APIDocumenation;

    if (isFileType && !f.file) {
      this.spinnerToasterService.showToaster('error', 'A file is required for this resource type');
      return;
    }

    if (isLinkType && !f.url.trim()) {
      this.spinnerToasterService.showToaster('error', 'A URL is required for this resource type');
      return;
    }

    if (f.durationInMinutes !== null && f.durationInMinutes < 0) {
      this.spinnerToasterService.showToaster('error', 'Duration must be greater than or equal to zero');
      return;
    }

    this.saving.set(true);

    const formData = new FormData();
    formData.append('Title', f.title.trim());
    formData.append('Description', f.description.trim());
    formData.append('Category', String(f.category));
    formData.append('ResourceType', String(f.resourceType));
    formData.append('Active', String(f.active));

    if (isLinkType) {
      formData.append('Url', f.url.trim());
    }

    if (isFileType && f.file) {
      formData.append('File', f.file, f.file.name);
    }

    if (type === DocumentationResourceType.VideoTutorial && f.durationInMinutes !== null) {
      formData.append('DurationInMinutes', String(f.durationInMinutes));
    }

    this.deploymentService.createDocumentationResource(formData).subscribe({
      next: (res) => {
        this.saving.set(false);

        if (res?.status) {
          this.spinnerToasterService.showToaster(
            'success',
            res.message || 'Documentation resource created successfully'
          );
          this.saved.emit();
        } else {
          this.spinnerToasterService.showToaster(
            'error',
            res?.message || 'Create failed'
          );
        }
      },
      error: (err) => {
        this.saving.set(false);
        console.error('Create documentation error:', err);

        let errorMessage = 'Create failed';

        if (err?.error?.errors) {
          errorMessage = Object.values(err.error.errors).flat().join(' | ');
        } else if (err?.error?.message) {
          errorMessage = err.error.message;
        } else if (typeof err?.error === 'string') {
          errorMessage = err.error;
        }

        this.spinnerToasterService.showToaster('error', errorMessage);
      },
    });
  }
}
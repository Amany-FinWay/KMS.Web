import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { LucideAngularModule, X, Upload } from 'lucide-angular';
import { SmartLockerService } from '../../../../core/services/smart-locker.service';
import { SpinnerToasterService } from '../../../../core/services/spinner-toaster.service';


@Component({
  selector: 'app-smart-locker-upload-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './smart-locker-upload-modal.component.html',
  styleUrl: './smart-locker-upload-modal.component.css',
})
export class SmartLockerUploadModalComponent {
  private smartLockerService = inject(SmartLockerService);
  private spinnerToasterService = inject(SpinnerToasterService);

  @Input() kioskId: number | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  readonly icons = {
    X,
    Upload,
  };

  file = signal<File | null>(null);
  saving = signal(false);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selectedFile = input.files?.[0] ?? null;

    if (!selectedFile) {
      this.file.set(null);
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      this.file.set(null);
      this.spinnerToasterService.showToaster(
        'error',
        'Only CSV files are allowed'
      );
      return;
    }

    this.file.set(selectedFile);
  }

  onSubmit(): void {
    if (!this.kioskId) {
      this.spinnerToasterService.showToaster(
        'error',
        'Please select a locker first'
      );
      return;
    }

    if (!this.file()) {
      this.spinnerToasterService.showToaster(
        'error',
        'Please select a CSV file'
      );
      return;
    }

    this.saving.set(true);

    this.smartLockerService.uploadCompartmentsCsv(this.kioskId, this.file()!).subscribe({
      next: (res) => {
        this.saving.set(false);

        if (res?.status) {
          this.spinnerToasterService.showToaster(
            'success',
            res.message || 'CSV uploaded successfully'
          );
          this.saved.emit();
        } else {
          this.spinnerToasterService.showToaster(
            'error',
            res?.message || 'Upload failed'
          );
        }
      },
      error: (err) => {
        this.saving.set(false);
        console.error(err);

        let errorMessage = 'Upload failed';

        if (err?.error?.message) {
          errorMessage = err.error.message;
        } else if (typeof err?.error === 'string') {
          errorMessage = err.error;
        }

        this.spinnerToasterService.showToaster('error', errorMessage);
      },
    });
  }
}
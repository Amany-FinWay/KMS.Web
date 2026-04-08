import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, UploadCloud } from 'lucide-angular';

import { SpinnerToasterService } from '../../../../../../core/services/spinner-toaster.service';
import { DeploymentService } from '../../../../../../core/services/deployment.service';
import { DeploymentPackageType } from '../../../../../../core/models/_enums/deployment.enums';

@Component({
  selector: 'app-deployment-package-upsert-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './deployment-package-upsert-modal.component.html',
  styleUrl: './deployment-package-upsert-modal.component.css',
})
export class DeploymentPackageUpsertModalComponent {
  private deploymentService = inject(DeploymentService);
  private spinnerToasterService = inject(SpinnerToasterService);

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  readonly icons = {
    X,
    UploadCloud,
  };

  readonly packageTypeOptions = [
    { value: DeploymentPackageType.Software, label: 'Software' },
    { value: DeploymentPackageType.Update, label: 'Update' },
    { value: DeploymentPackageType.SecurityPatch, label: 'Security Patch' },
    { value: DeploymentPackageType.Configuration, label: 'Configuration' },
  ];

  saving = signal(false);

  form = signal({
    name: '',
    description: '',
    version: '',
    packageType: DeploymentPackageType.Software,
    active: true,
    file: null as File | null,
  });

  updateForm(key: string, value: any): void {
    const numericFields = ['packageType'];

    this.form.update((prev) => ({
      ...prev,
      [key]: numericFields.includes(key) ? Number(value) : value,
    }));
  }

  onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.updateForm('file', null);
      return;
    }

    if (!file.name.toLowerCase().endsWith('.zip')) {
      input.value = '';
      this.updateForm('file', null);
      this.spinnerToasterService.showToaster('error', 'Only zip files are allowed');
      return;
    }

    this.updateForm('file', file);
  }

  onSubmit(): void {
    const f = this.form();

    if (!f.name.trim() || !f.description.trim() || !f.version.trim() || !f.file) {
      this.spinnerToasterService.showToaster(
        'error',
        'Name, description, version and zip package are required'
      );
      return;
    }

    this.saving.set(true);

    const formData = new FormData();
    formData.append('Name', f.name.trim());
    formData.append('Description', f.description.trim());
    formData.append('Version', f.version.trim());
    formData.append('PackageType', String(f.packageType));
    formData.append('Active', String(f.active));
    formData.append('PackageFile', f.file, f.file.name);

    this.deploymentService.createDeploymentPackage(formData).subscribe({
      next: (res) => {
        this.saving.set(false);

        if (res?.status) {
          this.spinnerToasterService.showToaster(
            'success',
            res.message || 'Deployment package created successfully'
          );
          this.saved.emit();
        } else {
          this.spinnerToasterService.showToaster(
            'error',
            res?.message || 'Create package failed'
          );
        }
      },
      error: (err) => {
        this.saving.set(false);
        console.error(err);

        let errorMessage = 'Create package failed';

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
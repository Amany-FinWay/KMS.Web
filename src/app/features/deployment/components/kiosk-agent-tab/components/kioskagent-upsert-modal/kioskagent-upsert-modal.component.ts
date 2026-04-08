import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, UploadCloud, Package, CalendarDays, ShieldCheck } from 'lucide-angular';

import { DeploymentService } from '../../../../../../core/services/deployment.service';
import { SpinnerToasterService } from '../../../../../../core/services/spinner-toaster.service';
import {
  AgentType,
  PlatformType,
} from '../../../../../../core/models/_enums/deployment.enums';

@Component({
  selector: 'app-kioskagent-upsert-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './kioskagent-upsert-modal.component.html',
  styleUrl: './kioskagent-upsert-modal.component.css'
})
export class KioskagentUpsertModalComponent implements OnInit {
  private deploymentService = inject(DeploymentService);
  private spinnerToasterService = inject(SpinnerToasterService);

  @Input() agentType: AgentType = AgentType.KioskAgent;

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  readonly icons = {
    X,
    UploadCloud,
    Package,
    CalendarDays,
    ShieldCheck,
  };

  readonly agentTypeOptions = [
    { value: AgentType.KioskAgent, label: 'Kiosk Agent' },
    { value: AgentType.DigitalSignageAgent, label: 'Digital Signage Agent' },
  ];

  readonly platformOptions = [
    { value: PlatformType.WindowsX64, label: 'Windows (x64)' },
    { value: PlatformType.WindowsX86, label: 'Windows (x86)' },
    { value: PlatformType.LinuxX64, label: 'Linux (x64)' },
    { value: PlatformType.Android, label: 'Android' },
    { value: PlatformType.RaspberryPiOS, label: 'Raspberry Pi OS' },
  ];

  saving = signal(false);

  form = signal({
    agentType: AgentType.KioskAgent,
    platform: PlatformType.WindowsX64,
    name: '',
    version: '',
    minimumOs: '',
    releasedAt: new Date().toISOString().substring(0, 10),
    isLatest: false,
    active: true,
    file: null as File | null,
  });

  ngOnInit(): void {
    this.form.update((prev) => ({
      ...prev,
      agentType: this.agentType,
    }));
  }

  updateForm(key: string, value: any): void {
    const numericFields = ['agentType', 'platform'];

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

    if (!f.name?.trim() || !f.version?.trim() || !f.minimumOs?.trim() || !f.file) {
      this.spinnerToasterService.showToaster(
        'error',
        'Please fill all required fields including Minimum OS and zip file'
      );
      return;
    }

    this.saving.set(true);

    const formData = new FormData();
    formData.append('AgentType', String(f.agentType));
    formData.append('Platform', String(f.platform));
    formData.append('Name', f.name.trim());
    formData.append('Version', f.version.trim());
    formData.append('ReleasedAt', f.releasedAt);
    formData.append('MinimumOs', f.minimumOs.trim());
    formData.append('Active', String(f.active));
    formData.append('IsLatest', String(f.isLatest));
    formData.append('PackageFile', f.file, f.file.name);

    this.deploymentService.createAgent(formData).subscribe({
      next: (res) => {
        this.saving.set(false);

        if (res?.status) {
          this.spinnerToasterService.showToaster(
            'success',
            res.message || 'Agent package created successfully'
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
        console.error('Create agent error:', err);

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
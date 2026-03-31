import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { LucideAngularModule, Lock, Package2, Upload, Download, Grid2x2, Box, CircleCheck } from 'lucide-angular';


import { SmartLockerUploadModalComponent } from './components/smart-locker-upload-modal/smart-locker-upload-modal.component';
import { SmartLockerService } from '../../core/services/smart-locker.service';
import { SpinnerToasterService } from '../../core/services/spinner-toaster.service';
import { SmartLockerCompartmentDto, SmartLockerDetailsDto, SmartLockerListItemDto } from '../../core/models/models/smart-locker.model';

@Component({
  selector: 'app-smart-locker-management',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    DatePipe,
    SmartLockerUploadModalComponent,
  ],
  templateUrl: './smart-locker-management.component.html',
  styleUrl: './smart-locker-management.component.css',
})
export class SmartLockerManagementComponent implements OnInit {
  private smartLockerService = inject(SmartLockerService);
  private spinnerToasterService = inject(SpinnerToasterService);

  readonly icons = {
    Lock,
    Package2,
    Upload,
    Download,
    Grid2x2,
    Box,
    CircleCheck,
  };

  loadingLockers = signal(false);
  loadingDetails = signal(false);
  isUploadModalOpen = signal(false);
  isReplenishmentMode = signal(false);

  lockers = signal<SmartLockerListItemDto[]>([]);
  selectedLockerId = signal<number | null>(null);
  selectedLockerDetails = signal<SmartLockerDetailsDto | null>(null);

  selectedLocker = computed(() =>
    this.lockers().find((x) => x.kioskId === this.selectedLockerId()) ?? null
  );

  hasSelectedLocker = computed(() => !!this.selectedLockerId() && !!this.selectedLockerDetails());

  ngOnInit(): void {
    this.loadSmartLockers();
  }

  loadSmartLockers(): void {
    this.loadingLockers.set(true);

    this.smartLockerService.getAllSmartLockers().subscribe({
      next: (res) => {
        this.loadingLockers.set(false);

        if (res?.status && Array.isArray(res.data)) {
          this.lockers.set(res.data);
        } else {
          this.lockers.set([]);
        }
      },
      error: (err) => {
        this.loadingLockers.set(false);
        this.lockers.set([]);
        console.error(err);
        this.spinnerToasterService.showToaster(
          'error',
          err?.error?.message || 'Failed to load smart lockers'
        );
      },
    });
  }

  selectLocker(kioskId: number): void {
    this.selectedLockerId.set(kioskId);
    this.loadSmartLockerDetails(kioskId);
  }

  loadSmartLockerDetails(kioskId: number): void {
    this.loadingDetails.set(true);

    this.smartLockerService.getSmartLockerById(kioskId).subscribe({
      next: (res) => {
        this.loadingDetails.set(false);

        if (res?.status && res.data) {
          this.selectedLockerDetails.set(res.data);
          this.loadSmartLockers();
        } else {
          this.selectedLockerDetails.set(null);
        }
      },
      error: (err) => {
        this.loadingDetails.set(false);
        this.selectedLockerDetails.set(null);
        console.error(err);
        this.spinnerToasterService.showToaster(
          'error',
          err?.error?.message || 'Failed to load smart locker details'
        );
      },
    });
  }

  toggleReplenishmentMode(): void {
    this.isReplenishmentMode.update((v) => !v);
  }

  downloadEmptyTemplate(): void {
    const lockerId = this.selectedLockerId();

    if (!lockerId) {
      this.spinnerToasterService.showToaster(
        'error',
        'Please select a locker first'
      );
      return;
    }

    this.smartLockerService.downloadEmptyCompartmentsCsv(lockerId);
  }

  openUploadModal(): void {
    if (!this.selectedLockerId()) {
      this.spinnerToasterService.showToaster(
        'error',
        'Please select a locker first'
      );
      return;
    }

    this.isUploadModalOpen.set(true);
  }

  closeUploadModal(): void {
    this.isUploadModalOpen.set(false);
  }

  onUploadSaved(): void {
    this.closeUploadModal();

    const lockerId = this.selectedLockerId();
    if (lockerId) {
      this.loadSmartLockerDetails(lockerId);
    }
  }

  getCompartmentCardClass(compartment: SmartLockerCompartmentDto): string {
    const status = (compartment.status || '').toLowerCase();

    if (status === 'assigned') {
      return 'border-[#60A5FA] bg-[#DBEAFE]';
    }

    if (status === 'delivered') {
      return 'border-[#22C55E] bg-[#DCFCE7]';
    }

    return 'border-[#D1D5DB] bg-[#F8FAFC]';
  }

  getCompartmentTextClass(compartment: SmartLockerCompartmentDto): string {
    const status = (compartment.status || '').toLowerCase();

    if (status === 'assigned') {
      return 'text-[#1D4ED8]';
    }

    if (status === 'delivered') {
      return 'text-[#15803D]';
    }

    return 'text-[#475569]';
  }

  getStatusBadgeClass(status?: string | null): string {
    const value = (status || '').toLowerCase();

    if (value === 'assigned') {
      return 'bg-[#DBEAFE] text-[#2563EB]';
    }

    if (value === 'delivered') {
      return 'bg-[#DCFCE7] text-[#16A34A]';
    }

    return 'bg-[#F1F5F9] text-[#334155]';
  }
}
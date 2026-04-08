import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule,
  Download,
  Plus,
  TriangleAlert,
  Play,
  CheckCircle2,
} from 'lucide-angular';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DeploymentService } from '../../../../core/services/deployment.service';
import { SpinnerToasterService } from '../../../../core/services/spinner-toaster.service';
import {
  DeploymentJobDetailsDto,
  ApiResponse,
  DeploymentPackageListDto,
} from '../../../../core/models/models/deployment.model';
import { KioskDto } from '../../../../core/models/models/kioskGeneral';
import { DeploymentPackageType, DeploymentJobStatus } from '../../../../core/models/_enums/deployment.enums';
import { DeploymentPackageUpsertModalComponent } from './components/deployment-package-upsert-modal/deployment-package-upsert-modal.component';

interface DeploymentKioskUi {
  id: number;
  name: string;
  subTitle: string;
  code: string;
  isActive: boolean;
  isOnline: boolean;
  selected: boolean;
}

interface DeploymentHistoryUi {
  id: number;
  packageName: string;
  packageVersion: string;
  status: number;
  statusName: string;
  startedAt: string;
  completedAt?: string | null;
  kioskCount: number;
  progressPercentage: number;
  kioskNames: string[];
}

@Component({
  selector: 'app-deployment-tab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    DatePipe,
    DeploymentPackageUpsertModalComponent,
  ],
  templateUrl: './deployment-tab.component.html',
  styleUrl: './deployment-tab.component.css',
})
export class DeploymentTabComponent implements OnInit {
  private deploymentService = inject(DeploymentService);
  private spinnerToasterService = inject(SpinnerToasterService);

  readonly icons = {
    Download,
    Plus,
    TriangleAlert,
    Play,
    CheckCircle2,
  };

  loading = signal(false);
  deploying = signal(false);
  isUploadModalOpen = signal(false);

  packages = signal<DeploymentPackageListDto[]>([]);
  kiosks = signal<DeploymentKioskUi[]>([]);
  history = signal<DeploymentHistoryUi[]>([]);

  selectedPackageId = signal<number | null>(null);

  selectedPackage = computed(() =>
    this.packages().find((x) => x.id === this.selectedPackageId()) ?? null
  );

  selectedKioskIds = computed(() =>
    this.kiosks()
      .filter((x) => x.selected)
      .map((x) => x.id)
  );

  canDeploy = computed(() =>
    !!this.selectedPackageId() &&
    this.selectedKioskIds().length > 0 &&
    !this.deploying()
  );

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    forkJoin({
      packages: this.deploymentService.getAllDeploymentPackages(),
      jobs: this.deploymentService.getAllJobs(),
      kiosks: this.deploymentService.getAllKiosks({
        search: null,
        active: true,
        isOnline: null,
        kioskType: null,
        pagination: {
          pageNumber: 1,
          pageSize: 1000,
        },
      }),
    })
      .pipe(
        switchMap(({ packages, jobs, kiosks }) => {
          this.packages.set(
            packages?.status && Array.isArray(packages.data) ? packages.data : []
          );

          const kioskItems =
            kiosks?.status && kiosks.data?.items ? kiosks.data.items : [];

          this.kiosks.set(
            kioskItems.map((k: KioskDto) => ({
              id: k.id,
              name: k.name,
              subTitle: k.location,
              code: k.code,
              isActive: k.active,
              isOnline: k.isOnline,
              selected: false,
            }))
          );

          const jobList = jobs?.status && Array.isArray(jobs.data) ? jobs.data : [];

          if (!jobList.length) {
            return of({ jobs: jobList, details: [] as ApiResponse<DeploymentJobDetailsDto>[] });
          }

          return forkJoin({
            jobs: of(jobList),
            details: forkJoin(
              jobList.slice(0, 10).map((job) => this.deploymentService.getJobById(job.id))
            ),
          });
        })
      )
      .subscribe({
        next: ({ jobs, details }) => {
          this.loading.set(false);

          const historyData: DeploymentHistoryUi[] = jobs.map((job, index) => {
            const detailRes = details[index];
            const detail = detailRes?.status ? detailRes.data : null;
            const targets = detail?.targets ?? [];

            const progressPercentage =
              job.totalTargets > 0
                ? Math.round((job.completedTargets / job.totalTargets) * 100)
                : 0;

            return {
              id: job.id,
              packageName: job.deploymentPackageName,
              packageVersion: job.deploymentPackageVersion,
              status: job.status,
              statusName: job.statusName,
              startedAt: job.startedAt,
              completedAt: job.completedAt,
              kioskCount: job.totalTargets,
              progressPercentage,
              kioskNames: targets.map((t) => t.kioskName),
            };
          });

          this.history.set(historyData);
        },
        error: (err) => {
          this.loading.set(false);
          console.error(err);
          this.spinnerToasterService.showToaster('error', 'Failed to load deployment data');
        },
      });
  }

  openUploadModal(): void {
    this.isUploadModalOpen.set(true);
  }

  closeUploadModal(): void {
    this.isUploadModalOpen.set(false);
  }

  onPackageSaved(): void {
    this.closeUploadModal();
    this.loadData();
  }

  selectPackage(id: number): void {
    this.selectedPackageId.set(id);
  }

  toggleKiosk(id: number): void {
    this.kiosks.update((items) =>
      items.map((k) =>
        k.id === id && k.isActive
          ? { ...k, selected: !k.selected }
          : k
      )
    );
  }

  selectAllKiosks(): void {
    this.kiosks.update((items) =>
      items.map((k) => ({
        ...k,
        selected: k.isActive,
      }))
    );
  }

  deployNow(): void {
    if (!this.canDeploy()) {
      this.spinnerToasterService.showToaster(
        'error',
        'Select one package and at least one kiosk'
      );
      return;
    }

    const packageId = this.selectedPackageId();
    if (!packageId) return;

    this.deploying.set(true);

    this.deploymentService
      .createDeploymentJob({
        deploymentPackageId: packageId,
        kioskIds: this.selectedKioskIds(),
        notes: null,
      })
      .subscribe({
        next: (res) => {
          this.deploying.set(false);

          if (res?.status) {
            this.spinnerToasterService.showToaster(
              'success',
              res.message || 'Deployment job created successfully'
            );

            this.kiosks.update((items) =>
              items.map((k) => ({ ...k, selected: false }))
            );
            this.selectedPackageId.set(null);
            this.loadData();
          } else {
            this.spinnerToasterService.showToaster(
              'error',
              res?.message || 'Deploy failed'
            );
          }
        },
        error: (err) => {
          this.deploying.set(false);
          console.error(err);
          this.spinnerToasterService.showToaster(
            'error',
            err?.error?.message || 'Deploy failed'
          );
        },
      });
  }

  getPackageTypeClass(type: number): string {
    switch (Number(type)) {
      case DeploymentPackageType.Update:
        return 'bg-[#DBEAFE] text-[#2563EB]';
      case DeploymentPackageType.Software:
        return 'bg-[#F3E8FF] text-[#9333EA]';
      case DeploymentPackageType.Configuration:
        return 'bg-[#FDE7C7] text-[#EA580C]';
      case DeploymentPackageType.SecurityPatch:
        return 'bg-[#DBEAFE] text-[#2563EB]';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  getPackageTypeLabel(typeName?: string): string {
    if (!typeName) return 'package';
    if (typeName === 'SecurityPatch') return 'update';
    if (typeName === 'Configuration') return 'config';
    if (typeName === 'Software') return 'software';
    if (typeName === 'Update') return 'update';
    return typeName.toLowerCase();
  }

  getHistoryStatusClass(status: number): string {
    switch (Number(status)) {
      case DeploymentJobStatus.Completed:
        return 'bg-[#DCFCE7] text-[#16A34A]';
      case DeploymentJobStatus.InProgress:
        return 'bg-[#DBEAFE] text-[#2563EB]';
      case DeploymentJobStatus.Failed:
        return 'bg-[#FEE2E2] text-[#DC2626]';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  getHistoryIcon(status: number): any {
    if (Number(status) === DeploymentJobStatus.Completed) {
      return this.icons.CheckCircle2;
    }

    return this.icons.Play;
  }
}
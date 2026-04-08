import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  LucideAngularModule,
  BookOpen,
  Download,
  MonitorPlay,
  Wrench,
  BookMarked,
  Boxes,
  CircleHelp,
  Video,
  FileCode2,
  Mail,
  Phone,
  MessageCircle,
  Plus,
} from 'lucide-angular';

import { DocumentationCategory, DocumentationResourceType } from '../../../../core/models/_enums/deployment.enums';
import { DocumentationResourceListDto } from '../../../../core/models/models/deployment.model';
import { DeploymentService } from '../../../../core/services/deployment.service';
import { SpinnerToasterService } from '../../../../core/services/spinner-toaster.service';
import { DocumentationUpsertModalComponent } from './components/documentation-upsert-modal/documentation-upsert-modal.component';

@Component({
  selector: 'app-documentation-tab',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, DocumentationUpsertModalComponent],
  templateUrl: './documentation-tab.component.html',
  styleUrl: './documentation-tab.component.css',
})
export class DocumentationTabComponent implements OnInit {
  private deploymentService = inject(DeploymentService);
  private spinnerToasterService = inject(SpinnerToasterService);

  readonly icons = {
    BookOpen,
    Download,
    MonitorPlay,
    Wrench,
    BookMarked,
    Boxes,
    CircleHelp,
    Video,
    FileCode2,
    Mail,
    Phone,
    MessageCircle,
    Plus,
  };

  loading = signal(false);
  resources = signal<DocumentationResourceListDto[]>([]);
  isModalOpen = signal(false);

  gettingStartedResources = computed(() =>
    this.resources().filter(
      (x) => Number(x.category) === DocumentationCategory.GettingStarted && x.active
    )
  );

  userGuideResources = computed(() =>
    this.resources().filter(
      (x) => Number(x.category) === DocumentationCategory.UserGuide && x.active
    )
  );

  videoTutorialResources = computed(() =>
    this.resources().filter(
      (x) => Number(x.category) === DocumentationCategory.VideoTutorial && x.active
    )
  );

  additionalSupportResources = computed(() =>
    this.resources().filter(
      (x) => Number(x.category) === DocumentationCategory.AdditionalSupport && x.active
    )
  );

  ngOnInit(): void {
    this.loadResources();
  }

  loadResources(): void {
    this.loading.set(true);

    this.deploymentService.getAllDocumentationResources().subscribe({
      next: (res) => {
        this.loading.set(false);

        if (res?.status && Array.isArray(res.data)) {
          this.resources.set(res.data);
        } else {
          this.resources.set([]);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.resources.set([]);
        console.error('Failed to load documentation resources', err);
        this.spinnerToasterService.showToaster(
          'error',
          err?.error?.message || 'Failed to load documentation resources'
        );
      },
    });
  }

  openUploadModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  onSaved(): void {
    this.closeModal();
    this.loadResources();
  }

  openResource(resource: DocumentationResourceListDto): void {
    const type = Number(resource.resourceType);

    if (
      type === DocumentationResourceType.ExternalLink ||
      type === DocumentationResourceType.APIDocumenation
    ) {
      if (!resource.url) {
        this.spinnerToasterService.showToaster('error', 'Resource URL is missing');
        return;
      }

      window.open(resource.url, '_blank');
      return;
    }

    if (!resource.filePath) {
      this.spinnerToasterService.showToaster('error', 'Resource file path is missing');
      return;
    }

    // لو عندك FilesController محتاج full path للدكيومنتيشن
    const fullPath = `C:\\KMS\\Documentation\\${resource.filePath}`;
    this.deploymentService.downloadFile(fullPath);
  }

  getResourceBadge(resource: DocumentationResourceListDto): string {
    switch (Number(resource.resourceType)) {
      case DocumentationResourceType.PdfDocument:
        return 'PDF Document';
      case DocumentationResourceType.VideoTutorial:
        return 'Video Tutorial';
      case DocumentationResourceType.ExternalLink:
        return 'External Link';
      case DocumentationResourceType.APIDocumenation:
        return 'API Documentation';
      default:
        return resource.resourceTypeName || 'Resource';
    }
  }

  getDurationText(resource: DocumentationResourceListDto): string {
    if (!resource.durationInMinutes || resource.durationInMinutes <= 0) {
      return resource.description || '';
    }

    return `${resource.durationInMinutes} min tutorial`;
  }

  getCardIcon(resource: DocumentationResourceListDto): any {
    const title = (resource.title || '').toLowerCase();
    const type = Number(resource.resourceType);

    if (type === DocumentationResourceType.VideoTutorial) {
      return this.icons.MonitorPlay;
    }

    if (title.includes('installation')) return this.icons.Wrench;
    if (title.includes('configuration')) return this.icons.Wrench;
    if (title.includes('deployment')) return this.icons.Boxes;
    if (title.includes('troubleshooting')) return this.icons.CircleHelp;
    if (title.includes('administrator')) return this.icons.BookMarked;

    return this.icons.BookOpen;
  }

  getAdditionalSupportIcon(resource: DocumentationResourceListDto): any {
    const type = Number(resource.resourceType);
    const title = (resource.title || '').toLowerCase();

    if (type === DocumentationResourceType.APIDocumenation) return this.icons.FileCode2;
    if (title.includes('video')) return this.icons.Video;
    return this.icons.CircleHelp;
  }

  contactSupport(): void {
    window.location.href = 'mailto:support@kioskmanager.com';
  }

  isApiDocumentation(resource: DocumentationResourceListDto): boolean {
  return Number(resource.resourceType) === DocumentationResourceType.APIDocumenation;
}

isExternalLink(resource: DocumentationResourceListDto): boolean {
  return Number(resource.resourceType) === DocumentationResourceType.ExternalLink;
}
}
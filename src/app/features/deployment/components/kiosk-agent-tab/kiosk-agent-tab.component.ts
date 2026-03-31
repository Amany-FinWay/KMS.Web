import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  LucideAngularModule,
  Download,
  Plus,
  Monitor,
  Tv,
  Laptop,
  Server,
} from 'lucide-angular';

import { AgentPackageListDto } from '../../../../core/models/models/deployment.model';
import { AgentType } from '../../../../core/models/_enums/deployment.enums';
import { DeploymentService } from '../../../../core/services/deployment.service';
import { SpinnerToasterService } from '../../../../core/services/spinner-toaster.service';
import { KioskagentUpsertModalComponent } from './components/kioskagent-upsert-modal/kioskagent-upsert-modal.component';

@Component({
  selector: 'app-kiosk-agent-tab',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    KioskagentUpsertModalComponent,
    DatePipe,
  ],
  templateUrl: './kiosk-agent-tab.component.html',
  styleUrl: './kiosk-agent-tab.component.css',
})
export class KioskAgentTabComponent implements OnInit {
  private deploymentService = inject(DeploymentService);
  private spinnerToasterService = inject(SpinnerToasterService);

  readonly icons = {
    Download,
    Plus,
    Monitor,
    Tv,
    Laptop,
    Server,
  };

  kioskAgents = signal<AgentPackageListDto[]>([]);
  digitalAgents = signal<AgentPackageListDto[]>([]);
  isModalOpen = signal(false);
  selectedAgentType = signal<AgentType>(AgentType.KioskAgent);
  loading = signal(false);

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents(): void {
    this.loading.set(true);

    this.deploymentService.getAgentPackages().subscribe({
      next: (res) => {
        this.loading.set(false);

        if (res?.status && res.data) {
          const allAgents = res.data ?? [];

          this.kioskAgents.set(
            allAgents.filter((x) => x.agentType === AgentType.KioskAgent)
          );

          this.digitalAgents.set(
            allAgents.filter(
              (x) => x.agentType === AgentType.DigitalSignageAgent
            )
          );
        } else {
          this.kioskAgents.set([]);
          this.digitalAgents.set([]);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.kioskAgents.set([]);
        this.digitalAgents.set([]);
        console.error('Failed to load agents', err);
      },
    });
  }

download(filePath: string): void {
  if (!filePath) {
    return;
  }

  this.deploymentService.downloadFile(filePath);
}

  openKioskAgentModal(): void {
    this.selectedAgentType.set(AgentType.KioskAgent);
    this.isModalOpen.set(true);
  }

  openDigitalAgentModal(): void {
    this.selectedAgentType.set(AgentType.DigitalSignageAgent);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  onSaved(): void {
    this.closeModal();
    this.loadAgents();
  }

  getKioskPlatformIcon(platformName?: string): any {
    const name = (platformName || '').toLowerCase();

    if (name.includes('linux')) return this.icons.Laptop;
    if (name.includes('windows')) return this.icons.Server;
    return this.icons.Monitor;
  }

  getDigitalPlatformIcon(platformName?: string): any {
    const name = (platformName || '').toLowerCase();

    if (name.includes('android')) return this.icons.Tv;
    if (name.includes('linux')) return this.icons.Laptop;
    if (name.includes('raspberry')) return this.icons.Monitor;
    if (name.includes('windows')) return this.icons.Server;
    return this.icons.Tv;
  }
}
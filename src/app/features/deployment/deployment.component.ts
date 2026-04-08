import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  LucideAngularModule,
  Download,
  Boxes,
  KeyRound,
  BookOpen,
  Package,
} from 'lucide-angular';

import { KioskAgentTabComponent } from './components/kiosk-agent-tab/kiosk-agent-tab.component';
import { DeploymentTabComponent } from './components/deployment-tab/deployment-tab.component';
import { LicensingTabComponent } from './components/licensing-tab/licensing-tab.component';
import { DocumentationTabComponent } from './components/documentation-tab/documentation-tab.component';

type DeploymentTabType =
  | 'kiosk-agent'
  | 'deployment'
  | 'licensing'
  | 'documentation';

@Component({
  selector: 'app-deployment',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    KioskAgentTabComponent,
    DeploymentTabComponent,
    LicensingTabComponent,
    DocumentationTabComponent,
  ],
  templateUrl: './deployment.component.html',
  styleUrl: './deployment.component.css',
})
export class DeploymentComponent {
  activeTab = signal<DeploymentTabType>('kiosk-agent');

  readonly icons = {
    Package,
    Download,
    Boxes,
    KeyRound,
    BookOpen,
  };

  setTab(tab: DeploymentTabType): void {
    this.activeTab.set(tab);
  }
}
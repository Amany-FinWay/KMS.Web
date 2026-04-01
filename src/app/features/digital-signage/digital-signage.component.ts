import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CalendarDays,
  FolderOpen,
  LayoutGrid,
  Layers3,
  LucideAngularModule,
  Monitor,
  Zap,
} from 'lucide-angular';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DigitalSignageTabId } from '../../core/models/_enums/digital-signage.enums';
import { ContentLibraryTabComponent } from './components/content-library-tab/content-library-tab.component';
import { GroupsTabComponent } from './components/groups-tab/groups-tab.component';
import { InstantControlTabComponent } from './components/instant-control-tab/instant-control-tab.component';
import { SchedulerTabComponent } from './components/scheduler-tab/scheduler-tab.component';
import { ScreensTabComponent } from './components/screens-tab/screens-tab.component';
import { TemplatesTabComponent } from './components/templates-tab/templates-tab.component';

type DigitalSignageIconKey =
  | 'Monitor'
  | 'Layers3'
  | 'FolderOpen'
  | 'CalendarDays'
  | 'LayoutGrid'
  | 'Zap';

@Component({
  selector: 'app-digital-signage',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ScreensTabComponent,
    GroupsTabComponent,
    ContentLibraryTabComponent,
    SchedulerTabComponent,
    TemplatesTabComponent,
    InstantControlTabComponent,
  ],
  templateUrl: './digital-signage.component.html',
  styleUrl: './digital-signage.component.css',
})
export class DigitalSignageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  activeTab = signal<DigitalSignageTabId>('content-library');

  readonly icons = {
    Monitor,
    Layers3,
    FolderOpen,
    CalendarDays,
    LayoutGrid,
    Zap,
  };

  readonly tabs: { id: DigitalSignageTabId; label: string; icon: DigitalSignageIconKey }[] = [
    { id: 'screens', label: 'Screens', icon: 'Monitor' },
    { id: 'groups', label: 'Groups', icon: 'Layers3' },
    { id: 'content-library', label: 'Content Library', icon: 'FolderOpen' },
    { id: 'scheduler', label: 'Scheduler', icon: 'CalendarDays' },
    { id: 'templates', label: 'Templates', icon: 'LayoutGrid' },
    { id: 'instant-control', label: 'Instant Control', icon: 'Zap' },
  ];

  constructor() {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const tab = params.get('tab');
        this.activeTab.set(this.isValidTab(tab) ? tab : 'content-library');
      });
  }

  setTab(tab: DigitalSignageTabId): void {
    if (this.activeTab() === tab) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  isActiveTab(tab: DigitalSignageTabId): boolean {
    return this.activeTab() === tab;
  }

  getTabIcon(icon: DigitalSignageIconKey) {
    return this.icons[icon];
  }

  private isValidTab(tab: string | null): tab is DigitalSignageTabId {
    return this.tabs.some((item) => item.id === tab);
  }
}

import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Activity,
  LucideAngularModule,
  Monitor,
  Plus,
  Power,
  RefreshCw,
  Search,
  Settings2,
} from 'lucide-angular';

type ScreenStatus = 'Online' | 'Offline' | 'Error';

interface ScreenInventoryItem {
  id: string;
  name: string;
  code: string;
  group: string;
  groupColor: string;
  location: string;
  status: ScreenStatus;
  resolution: string;
  ipAddress: string;
  uptime: string;
  currentContent: string;
}

@Component({
  selector: 'app-screens-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './screens-tab.component.html',
  styleUrl: './screens-tab.component.css',
})
export class ScreensTabComponent {
  readonly icons = {
    Monitor,
    Activity,
    Power,
    Settings2,
    Plus,
    Search,
    RefreshCw,
  };

  readonly screens: ScreenInventoryItem[] = [
    {
      id: 'ds001',
      name: 'Main Lobby Display',
      code: 'DS001',
      group: 'Main Terminals',
      groupColor: 'bg-[#4A7EF0]',
      location: 'Terminal 1 - Main Entrance',
      status: 'Online',
      resolution: '1920x1080',
      ipAddress: '192.168.1.101',
      uptime: '99.8%',
      currentContent: 'Welcome Campaign',
    },
    {
      id: 'ds002',
      name: 'Gate Area Display 1',
      code: 'DS002',
      group: 'Gate Displays',
      groupColor: 'bg-[#18C37E]',
      location: 'Terminal 1 - Gate A',
      status: 'Online',
      resolution: '1920x1080',
      ipAddress: '192.168.1.102',
      uptime: '99.9%',
      currentContent: 'Flight Schedule',
    },
    {
      id: 'ds003',
      name: 'Gate Area Display 2',
      code: 'DS003',
      group: 'Gate Displays',
      groupColor: 'bg-[#18C37E]',
      location: 'Terminal 1 - Gate B',
      status: 'Online',
      resolution: '1920x1080',
      ipAddress: '192.168.1.103',
      uptime: '98.5%',
      currentContent: 'Flight Schedule',
    },
    {
      id: 'ds004',
      name: 'Retail Area Portrait',
      code: 'DS004',
      group: 'Commercial Areas',
      groupColor: 'bg-[#F7A40A]',
      location: 'Shopping Area - Section C',
      status: 'Online',
      resolution: '1080x1920',
      ipAddress: '192.168.1.104',
      uptime: '99.2%',
      currentContent: 'Promotional Ads',
    },
    {
      id: 'ds005',
      name: 'Food Court Display',
      code: 'DS005',
      group: 'Commercial Areas',
      groupColor: 'bg-[#F7A40A]',
      location: 'Food Court - Center',
      status: 'Error',
      resolution: '1920x1080',
      ipAddress: '192.168.1.105',
      uptime: '85.3%',
      currentContent: 'Menu Promotion',
    },
    {
      id: 'ds006',
      name: 'Wayfinding Display',
      code: 'DS006',
      group: 'Information Points',
      groupColor: 'bg-[#8B5CF6]',
      location: 'Terminal 2 - Junction',
      status: 'Offline',
      resolution: '1920x1080',
      ipAddress: '192.168.1.106',
      uptime: '0%',
      currentContent: 'Direction Guide',
    },
    {
      id: 'ds007',
      name: 'Information Desk Display',
      code: 'DS007',
      group: 'Information Points',
      groupColor: 'bg-[#8B5CF6]',
      location: 'Terminal 1 - Info Desk',
      status: 'Online',
      resolution: '1920x1080',
      ipAddress: '192.168.1.107',
      uptime: '99.5%',
      currentContent: 'Information Slides',
    },
    {
      id: 'ds008',
      name: 'Parking Display',
      code: 'DS008',
      group: 'Information Points',
      groupColor: 'bg-[#8B5CF6]',
      location: 'Parking Level 2',
      status: 'Online',
      resolution: '1280x720',
      ipAddress: '192.168.1.108',
      uptime: '97.8%',
      currentContent: 'Parking Info',
    },
  ];

  readonly searchTerm = signal('');
  readonly selectedGroup = signal('All Groups');
  readonly selectedScreenId = signal('ds007');

  readonly groupOptions = ['All Groups', 'Main Terminals', 'Gate Displays', 'Commercial Areas', 'Information Points'];

  readonly filteredScreens = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const group = this.selectedGroup();

    return this.screens.filter((screen) => {
      const matchesGroup = group === 'All Groups' || screen.group === group;
      const matchesSearch =
        !search ||
        screen.name.toLowerCase().includes(search) ||
        screen.location.toLowerCase().includes(search) ||
        screen.code.toLowerCase().includes(search);

      return matchesGroup && matchesSearch;
    });
  });

  readonly stats = computed(() => ({
    totalScreens: this.screens.length,
    online: this.screens.filter((screen) => screen.status === 'Online').length,
    offline: this.screens.filter((screen) => screen.status === 'Offline').length,
    errors: this.screens.filter((screen) => screen.status === 'Error').length,
  }));

  selectScreen(screenId: string): void {
    this.selectedScreenId.set(screenId);
  }

  refreshList(): void {
    this.searchTerm.set('');
    this.selectedGroup.set('All Groups');
    this.selectedScreenId.set('ds007');
  }

  getScreenCardClass(screen: ScreenInventoryItem): string {
    return this.selectedScreenId() === screen.id
      ? 'border-[#93C5FD] bg-[#FDFEFF]'
      : 'border-[#D9DFEA] bg-white';
  }

  getStatusDotClass(status: ScreenStatus): string {
    if (status === 'Online') return 'bg-[#22C55E]';
    if (status === 'Error') return 'bg-[#FF2F2F]';
    return 'bg-[#98A2B3]';
  }

  getStatusTextClass(status: ScreenStatus): string {
    if (status === 'Online') return 'text-[#00153D]';
    if (status === 'Error') return 'text-[#00153D]';
    return 'text-[#00153D]';
  }

  getMonitorBadgeClass(status: ScreenStatus): string {
    if (status === 'Error') return 'bg-[#FF2F2F]';
    return 'bg-[#10C44C]';
  }
}

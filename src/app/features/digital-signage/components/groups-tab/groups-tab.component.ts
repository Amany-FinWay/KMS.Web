import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import {
  Layers3,
  LucideAngularModule,
  Monitor,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-angular';

interface GroupScreenItem {
  id: string;
  name: string;
  location: string;
  status: 'Online' | 'Offline';
  code: string;
}

interface ScreenGroupCard {
  id: string;
  title: string;
  description: string;
  screensCount: number;
  onlineCount: number;
  accent: string;
  accentSoft: string;
  screens: GroupScreenItem[];
}

@Component({
  selector: 'app-groups-tab',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './groups-tab.component.html',
  styleUrl: './groups-tab.component.css',
})
export class GroupsTabComponent {
  readonly icons = {
    Layers3,
    Plus,
    Pencil,
    Trash2,
    Monitor,
  };

  readonly groups: ScreenGroupCard[] = [
    {
      id: 'main-terminals',
      title: 'Main Terminals',
      description: 'Primary terminal displays for general announcements',
      screensCount: 2,
      onlineCount: 1,
      accent: 'text-[#3B82F6]',
      accentSoft: 'bg-[#3B82F6]',
      screens: [
        {
          id: 'main-lobby',
          name: 'Main Lobby Display',
          location: 'Terminal 1 - Main Entrance',
          status: 'Online',
          code: 'DS001',
        },
        {
          id: 'waiting-area',
          name: 'Waiting Area Display',
          location: 'Terminal 2 - Waiting Lounge',
          status: 'Offline',
          code: 'DS006',
        },
      ],
    },
    {
      id: 'gate-displays',
      title: 'Gate Displays',
      description: 'Gate area screens showing flight information',
      screensCount: 2,
      onlineCount: 2,
      accent: 'text-[#10B981]',
      accentSoft: 'bg-[#10B981]',
      screens: [
        {
          id: 'gate-a1',
          name: 'Gate A1 Display',
          location: 'Terminal A - Gate A1',
          status: 'Online',
          code: 'DS010',
        },
        {
          id: 'gate-b3',
          name: 'Gate B3 Display',
          location: 'Terminal B - Gate B3',
          status: 'Online',
          code: 'DS014',
        },
      ],
    },
    {
      id: 'commercial-areas',
      title: 'Commercial Areas',
      description: 'Retail and dining area promotional displays',
      screensCount: 2,
      onlineCount: 1,
      accent: 'text-[#F59E0B]',
      accentSoft: 'bg-[#F59E0B]',
      screens: [
        {
          id: 'food-court',
          name: 'Food Court Promo Screen',
          location: 'Food Court - Central Hall',
          status: 'Online',
          code: 'DS021',
        },
        {
          id: 'retail-corner',
          name: 'Retail Corner Display',
          location: 'Retail Wing - Level 1',
          status: 'Offline',
          code: 'DS022',
        },
      ],
    },
    {
      id: 'information-points',
      title: 'Information Points',
      description: 'Information and wayfinding displays',
      screensCount: 2,
      onlineCount: 2,
      accent: 'text-[#8B5CF6]',
      accentSoft: 'bg-[#8B5CF6]',
      screens: [
        {
          id: 'arrivals',
          name: 'Arrivals Information Screen',
          location: 'Terminal 1 - Arrivals Hall',
          status: 'Online',
          code: 'DS031',
        },
        {
          id: 'wayfinding',
          name: 'Wayfinding Kiosk Display',
          location: 'Terminal 2 - Cross Junction',
          status: 'Online',
          code: 'DS032',
        },
      ],
    },
  ];

  readonly selectedGroupId = signal<string | null>(null);

  readonly selectedGroup = computed(
    () => this.groups.find((group) => group.id === this.selectedGroupId()) ?? null,
  );

  selectGroup(groupId: string): void {
    this.selectedGroupId.set(groupId);
  }
}

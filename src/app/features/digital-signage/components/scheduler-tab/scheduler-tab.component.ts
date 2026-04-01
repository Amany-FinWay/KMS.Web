import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  CalendarDays,
  Clock3,
  LucideAngularModule,
  Pause,
  Pencil,
  Play,
  Plus,
  Trash2,
} from 'lucide-angular';

@Component({
  selector: 'app-scheduler-tab',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './scheduler-tab.component.html',
  styleUrl: './scheduler-tab.component.css',
})
export class SchedulerTabComponent {
  readonly icons = {
    CalendarDays,
    Clock3,
    Pause,
    Pencil,
    Play,
    Plus,
    Trash2,
  };

  readonly stats = {
    totalSchedules: 5,
    activeNow: 4,
    scheduled: 1,
  };

  readonly schedules = [
    {
      id: 'morning-welcome',
      title: 'Morning Welcome Campaign',
      status: 'active',
      priority: 'Priority 1',
      contentName: 'Welcome Campaign 2024',
      contentType: 'VIDEO',
      dateRange: '3/1/2024 - 3/31/2024',
      timeRange: '06:00 - 12:00',
      days: 'Mon, Tue, Wed, Thu, Fri',
      screenGroupsText: '2 groups',
      groups: ['Main Terminals', 'Gate Displays'],
    },
    {
      id: 'retail-promotions',
      title: 'Retail Promotions',
      status: 'active',
      priority: 'Priority 2',
      contentName: 'Spring Sale Promotion',
      contentType: 'IMAGE',
      dateRange: '3/8/2024 - 3/20/2024',
      timeRange: '09:00 - 21:00',
      days: 'Sun, Mon, Tue, Wed, Thu, Fri, Sat',
      screenGroupsText: '1 groups',
      groups: ['Commercial Areas'],
    },
    {
      id: 'safety-information',
      title: 'Safety Information Display',
      status: 'active',
      priority: 'Priority 3',
      contentName: 'Safety Guidelines',
      contentType: 'PDF',
      dateRange: '3/5/2024 - 12/31/2024',
      timeRange: '00:00 - 23:59',
      days: 'Sun, Mon, Tue, Wed, Thu, Fri, Sat',
      screenGroupsText: '2 groups',
      groups: ['Main Terminals', 'Information Points'],
    },
    {
      id: 'lunch-menu',
      title: 'Lunch Menu Display',
      status: 'active',
      priority: 'Priority 1',
      contentName: 'Restaurant Menu Board',
      contentType: 'PPTX',
      dateRange: '3/1/2024 - 3/15/2024',
      timeRange: '11:00 - 14:00',
      days: 'Mon, Tue, Wed, Thu, Fri',
      screenGroupsText: '1 groups',
      groups: ['Commercial Areas'],
    },
    {
      id: 'upcoming-brand',
      title: 'Upcoming Brand Campaign',
      status: 'scheduled',
      priority: 'Priority 1',
      contentName: 'Brand Introduction Video',
      contentType: 'VIDEO',
      dateRange: '4/1/2024 - 4/30/2024',
      timeRange: '08:00 - 18:00',
      days: 'Mon, Tue, Wed, Thu, Fri',
      screenGroupsText: '2 groups',
      groups: ['Main Terminals', 'Information Points'],
    },
  ];

  getStatusBadgeClass(status: string): string {
    return status === 'active'
      ? 'bg-[#D9FBE8] text-[#16A34A]'
      : 'bg-[#DBEAFE] text-[#2563EB]';
  }

  getPriorityBadgeClass(priority: string): string {
    switch (priority) {
      case 'Priority 2':
        return 'bg-[#F3E8FF] text-[#9333EA]';
      case 'Priority 3':
        return 'bg-[#F3E8FF] text-[#7C3AED]';
      default:
        return 'bg-[#F3E8FF] text-[#7C3AED]';
    }
  }

  getGroupBadgeClass(group: string): string {
    switch (group) {
      case 'Gate Displays':
        return 'bg-[#10B981]';
      case 'Commercial Areas':
        return 'bg-[#F59E0B]';
      case 'Information Points':
        return 'bg-[#8B5CF6]';
      default:
        return 'bg-[#3B82F6]';
    }
  }
}

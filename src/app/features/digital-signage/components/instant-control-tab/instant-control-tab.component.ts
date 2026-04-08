import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule, PlayCircle, Zap } from 'lucide-angular';

@Component({
  selector: 'app-instant-control-tab',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './instant-control-tab.component.html',
  styleUrl: './instant-control-tab.component.css',
})
export class InstantControlTabComponent {
  readonly icons = {
    Zap,
    PlayCircle,
  };
}

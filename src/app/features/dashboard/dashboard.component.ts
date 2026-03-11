import { Component } from '@angular/core';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { 
  LucideAngularModule, 
  Monitor,
  Activity,
  DollarSign,
  AlertTriangle
} from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, StatCardComponent, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  readonly icons = {
    Monitor,
    Activity,
    DollarSign,
    AlertTriangle,
  };
}

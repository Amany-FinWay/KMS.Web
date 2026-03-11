import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.css'
})
export class StatCardComponent {
  label = input.required<string>();      
  value = input.required<string | number>(); 
  total = input<string | number>();      
  icon = input.required<any>();          
  colorClass = input<string>('bg-blue-600'); 
  
  trend = input<{ value: string, isUp: boolean }>(); 
}
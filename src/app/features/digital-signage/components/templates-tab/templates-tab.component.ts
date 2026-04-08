import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LayoutGrid, LucideAngularModule, Palette } from 'lucide-angular';

@Component({
  selector: 'app-templates-tab',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './templates-tab.component.html',
  styleUrl: './templates-tab.component.css',
})
export class TemplatesTabComponent {
  readonly icons = {
    LayoutGrid,
    Palette,
  };
}

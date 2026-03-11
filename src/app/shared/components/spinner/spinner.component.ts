import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { SpinnerToasterService } from '../../../core/services/spinner-toaster.service';
import { LucideAngularModule, Monitor } from 'lucide-angular';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule, AsyncPipe, LucideAngularModule],
  template: `
    <div
      *ngIf="spinnerToasterService.spinner$ | async"
      class="fixed inset-0 flex justify-center items-center bg-slate-900/60 backdrop-blur-md z-[10002] transition-all duration-500"
    >
      <div class="relative flex flex-col items-center">
        <div class="relative h-24 w-24 flex items-center justify-center">
          <div
            class="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500/10 border-l-transparent animate-spin"
          ></div>
          <div
            class="absolute inset-2 rounded-full border-4 border-t-transparent border-r-emerald-500 border-b-transparent border-l-emerald-500/10 animate-[spin_2s_linear_infinite_reverse]"
          ></div>

          <div class="relative animate-pulse">
            <lucide-angular
              name="monitor"
              class="text-white w-10 h-10"
            ></lucide-angular>
          </div>
        </div>

        <div class="mt-8 flex flex-col items-center gap-2">
          <span
            class="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400"
          >
            Kiosk System
          </span>
          <span class="text-sm font-medium text-white/90">
            Your request is being processed
          </span>

          <div class="flex gap-1.5 mt-1">
            <span class="h-1 w-3 rounded-full bg-blue-500 animate-pulse"></span>
            <span
              class="h-1 w-3 rounded-full bg-emerald-500 animate-pulse [animation-delay:0.2s]"
            ></span>
            <span
              class="h-1 w-3 rounded-full bg-blue-500 animate-pulse [animation-delay:0.4s]"
            ></span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SpinnerComponent {
  constructor(public spinnerToasterService: SpinnerToasterService) {}
}

import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { SpinnerToasterService } from '../../../core/services/spinner-toaster.service';
import { LucideAngularModule, CheckCircle, XCircle, AlertTriangle, X } from 'lucide-angular';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule, AsyncPipe, LucideAngularModule], 
  template: `
    <div
      *ngIf="spinnerToasterService.toaster$ | async as t"
      class="fixed top-10 left-1/2 -translate-x-1/2 z-[10001] min-w-[320px] max-w-[90vw]"
    >
      <div
        class="relative flex items-center p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border backdrop-blur-xl animate-in fade-in slide-in-from-top-10 duration-500"
        [ngClass]="{
          'bg-emerald-500/90 border-emerald-400': t.type === 'success',
          'bg-red-500/90 border-red-400': t.type === 'error',
          'bg-amber-500/90 border-amber-400': t.type === 'warning'
        }"
      >
        <div class="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3 rtl:mr-0 rtl:ml-3">
          <lucide-angular
            [name]="t.type === 'success' ? 'check-circle' : (t.type === 'error' ? 'x-circle' : 'alert-triangle')"
            class="text-white w-6 h-6"
          ></lucide-angular>
        </div>

        <div class="flex-grow">
          <p class="text-white font-black text-[13px] rtl:text-[15px] leading-snug">
            {{ t.message }}
          </p>
        </div>
      </div>
    </div>
  `,
})
export class ToasterComponent {
  constructor(public spinnerToasterService: SpinnerToasterService) {}
}
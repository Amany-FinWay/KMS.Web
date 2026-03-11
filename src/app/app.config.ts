import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection,
  importProvidersFrom
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { apiBaseUrlInterceptor } from './core/interceptors/api-base-url.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { ConfigService } from './core/services/config.service';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { LucideAngularModule, CheckCircle, XCircle, AlertTriangle, X, Mail, Lock, Eye, EyeOff, Monitor } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([
        apiBaseUrlInterceptor, 
        authInterceptor,
        loadingInterceptor
      ]),
    ),
    importProvidersFrom(
      LucideAngularModule.pick({ CheckCircle, XCircle, AlertTriangle, X, Mail, Lock, Eye, EyeOff, Monitor })
    ),
    provideAppInitializer(() => {
      const configService = inject(ConfigService);
      return configService.load();
    }),
  ],
};

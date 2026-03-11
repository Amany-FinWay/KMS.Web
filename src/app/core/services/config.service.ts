import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, take } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private configSubject = new BehaviorSubject<any>(null);

  async load(): Promise<void> {
    try {
      const response = await fetch(environment.configFile); 
      const data = await response.json();
      this.configSubject.next(data);
    } catch (err) {
      console.error('Config loading failed', err);
    }
  }

  get config$(): Observable<any> {
    return this.configSubject.asObservable().pipe(
      filter((c) => c !== null),
      take(1),
    );
  }

  get serverUrl(): string {
    return this.configSubject.value?.serverUrl || '';
  }
}
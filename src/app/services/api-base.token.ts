import { InjectionToken } from '@angular/core';

export const API_BASE = new InjectionToken<string>('API_BASE', {
  providedIn: 'root',
  factory: () => '', // browser uses relative URLs
});

import { InjectionToken } from '@angular/core';

export interface Environment {
  production: boolean;
  baseEndpoint: string,
  publicChatName: string,
  firebase: any;
}

export const ENVIRONMENT = new InjectionToken<Environment>('environment');

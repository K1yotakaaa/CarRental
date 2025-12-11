import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    provideHttpClient(withInterceptors([authInterceptor])),

    {
      provide: 'FIREBASE_APP',
      useFactory: () => initializeApp(environment.firebase),
    },
    {
      provide: 'FIRESTORE',
      useFactory: () => getFirestore(),
    },
    {
      provide: 'REALTIME_DB',
      useFactory: () => getDatabase(),
    },
  ],
};

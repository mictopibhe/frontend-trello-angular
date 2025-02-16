import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient} from '@angular/common/http';
import {provideStore} from '@ngrx/store';
import {environment} from '../environments/environment';
import {reducer} from './store/actions/reducers';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {provideEffects} from '@ngrx/effects';
import {RegisterEffect} from './store/effects/register.effect';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({auth: reducer}),
    provideEffects(RegisterEffect),
    provideStoreDevtools({maxAge: 25, logOnly: environment.production}),
  ]
};

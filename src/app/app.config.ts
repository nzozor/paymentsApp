import {ApplicationConfig, importProvidersFrom} from '@angular/core';

import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {HttpClientModule, provideHttpClient, withFetch} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [ provideClientHydration(), provideAnimationsAsync(), importProvidersFrom(HttpClientModule),     provideHttpClient(withFetch()),
  ]
};

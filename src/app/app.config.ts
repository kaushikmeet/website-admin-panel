import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter} from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr} from 'ngx-toastr';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from './services/user.service';
import { authInterceptor } from './services/auth.interceptor';
import { SearchPipe } from './pipes/search.pipe';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), provideAnimationsAsync(), 
    provideHttpClient(withInterceptors([authInterceptor])), 
    provideToastr(),
    JwtHelperService,
    SearchPipe,
    UserService,{provide: JWT_OPTIONS, useValue: JWT_OPTIONS}
  ]
};

import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ApiInterceptor } from '../shared/interceptors';
import { LoginComponent } from '../shared/components/login/login.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass:ApiInterceptor, multi:true },
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      multi: true,
      deps: [MatDialog]
    }
  ]
};

export function initApp(_dialog: MatDialog
  /*_router: Router, _api: APIService, _localStorage: LocalStorageService,*/) {
  return () => {
    return new Promise(
      async (resolve) => {
        const dialogRef = _dialog.open(LoginComponent, {
          width: '400px',
          height: '350px',
          data: { }
        });
    
        await dialogRef.afterClosed().toPromise().then(result => {
          console.log(result);
        })

        resolve(true);
        return;
        /* Carregamento inicial de dados por Network - Fim */
      }
    );
  };
}

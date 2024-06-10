
import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoaderService, LocalStorageService, SnackbarMessagesService } from '../../services';
import { environment } from '../../../environments/environment';
import StringUtils from '../../utils/string/string.utils';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private _loader = inject(LoaderService);
  private _snackbarMessage = inject(SnackbarMessagesService);
  private _localStorage = inject(LocalStorageService);

  private requests: HttpRequest<any>[] = [];
  private exceptions404: Set<string> = new Set([]);
  private exceptionsLoading: Set<string> = new Set([]);

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    req= req.clone({ url: StringUtils.removeDoubleBars(req.url) });
    // req = req.clone({ setHeaders: { 'Req-Test': "Header-Test" } });
    
    if(!this.hasUrl(req.url, this.exceptionsLoading)) {
      this.requests.push(req);
      this._loader.showLoading(true); 
    }   

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 400:
              if(error?.error?.message) {
                this._snackbarMessage.showSnackbarMessages({
                  message: error.error.message,
                  type: "warning",
                  has_duration: true
                });
              }
              break;
            case 401:
              if(req.url.includes(environment.application.api.url)) {
                this._localStorage.clearStorageData(["auth"]);

                this._snackbarMessage.showSnackbarMessages({
                  message: "Usuário não autenticado!",
                  type: "warning",
                  has_duration: true
                });

                window.location.reload();
              } 
              break;
            case 403:
              if(req.url.includes(environment.application.api.url)) {
                this._localStorage.clearStorageData(["auth"]);

                this._snackbarMessage.showSnackbarMessages({
                  message: "Usuário não autorizado!",
                  type: "warning",
                  has_duration: true
                });
              } 
              break;
            case 404:
              if(req.url.includes(environment.application.api.url) && !this.hasUrl(error?.url, this.exceptions404)) {
                this._snackbarMessage.showSnackbarMessages({
                  message: "Recurso não encontrado.",
                  type: "warning",
                  has_duration: true
                });
              }
              break;
            case 500:
              if(req.url.includes(environment.application.api.url)) {
                this._loader.showLoading(true);
                this._snackbarMessage.showSnackbarMessages({
                  message: "Erro interno no servidor!",
                  type: "error",
                  has_duration: true
                });
              }
              break;
          }
        }

        return throwError(error);
      }),
      finalize(() => { this.removeRequest(req); })
    );
  }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);

    if (i >= 0) {
      this.requests.splice(i, 1);
    }

    this._loader.showLoading(this.requests.length > 0);
  }

  hasUrl(url: string | null, exceptions: Set<string>): boolean {
    let match = false;

    for (const exception of Array.from(exceptions)) {
      if (url?.match(exception)) {
        match = true;
        break;
      }
    }

    return match;
  }
}
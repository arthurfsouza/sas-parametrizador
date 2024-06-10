import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService, SnackbarMessagesService } from '../../services';
import { Auth } from './auth.interface';
import { general } from '../../configurations';

@Injectable()
export class AuthGuard implements CanActivate {
    private _localStorage = inject(LocalStorageService);
    private _snackbar = inject(SnackbarMessagesService);

    constructor(private _router: Router) {}

    canActivate(): Promise<boolean> {
        return new Promise(
            async (resolve) => {
                const auth: Auth | null = this._localStorage.getStorageData('auth');
                
                if(!auth || !auth?.token) {
                    this._snackbar.showSnackbarMessages({
                        message: "Usuário não autenticado!",
                        type: "warning",
                        has_duration: true
                    });

                    resolve(false);

                    this._router.navigate([general.routes.auth.error.unauthorized]);
                    window.location.reload();

                    return;
                }
                
                resolve(true);
                return;
            }
        );        
    }
}
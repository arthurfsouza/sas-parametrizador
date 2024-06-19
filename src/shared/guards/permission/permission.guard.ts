import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { Auth } from '../auth/auth.interface';
import { general } from '../../configurations';

@Injectable()
export class PermissionGuard implements CanActivate {
    private _localStorage = inject(LocalStorageService);

    constructor(private _router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return new Promise((resolve) => {
            const roles = route.data["roles"] as Array<string>;
            const contains = route.data["contains"] as boolean;
            
            if(contains){
                for(let role of roles){
                    if(this.containsPermission(role)){
                        resolve(true);
                        return;
                    }
                }
            }
            else {
                for(let role of roles){
                    if(this.hasPermission(role)){
                        resolve(true);
                        return;
                    }
                }
            }
            
            this._router.navigate([general.routes.auth.error.permissionDenied]);
            resolve(false);
        });
    }

    hasPermission(permission: string): boolean {
        const permissions: Set<String> = this.getPermissions();
        let resolvePermissions = false;
        
        try { resolvePermissions = permissions.has(permission); }
        catch { }

        return resolvePermissions;
    }

    containsPermission(permission: string): boolean {
        const permissions: Set<String> = this.getPermissions();
        let resolvePermissions = false;
        
        try { permissions.forEach(p => { if(p.indexOf(permission) > 0) { resolvePermissions = true; } }); }
        catch { }

        return resolvePermissions;
    }

    getPermissions(): Set<String> {
        const auth: Auth | null = this._localStorage.getStorageData('auth');
        const data: string[] | null = auth?.user.permissions || [];

        let permissions: Set<String> = new Set();

        if(data && data.length > 0) { data.map((p: string) => { permissions.add(p); }); }

        return permissions;
    }
}
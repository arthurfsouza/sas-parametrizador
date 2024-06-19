import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Auth, AuthService } from '../../guards';
import { DataStorage, LocalStorageService } from '../../services';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'menu-navigator',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './menu-navigator.component.html',
  styleUrl: './menu-navigator.component.scss'
})
export class MenuNavigatorComponent {
  private _localStorage = inject(LocalStorageService);
  private _auth = inject(AuthService);

  constructor(private _router: Router) { }

  public auth: Auth | null = this._localStorage.getStorageData('auth');

  ngOnInit(): void {
    this._localStorage.getStorage().subscribe((dataStorage: DataStorage) => {
      if(dataStorage?.type == "auth") { this.auth = dataStorage?.data; }
    });
  }

  public onLogout(): void { this._auth.logout(); }

  public onRedirect(router: string): void { this._router.navigate([router]); }

  public bindingRouters(bindingRouters: string[]): boolean {
    const URL: string = this._router.url;
    let bindingClass: boolean = false;

    for(let auxRouter of bindingRouters) {
        if(URL.includes(auxRouter)) {
          bindingClass = true;
          break;
        }
    }

    return bindingClass;
  }

  public checkPermissions(permissions: string[]): boolean {
    const authPermissions: string[] = this.auth?.user?.permissions || [];
    let containsPermission: boolean = false;

    for(let permission of permissions){
      if(authPermissions.includes(permission)){
        containsPermission = true;
        break;
      }
    }

    return containsPermission;
  }
}
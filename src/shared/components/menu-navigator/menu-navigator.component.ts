import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'menu-navigator',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './menu-navigator.component.html',
  styleUrl: './menu-navigator.component.scss'
})
export class MenuNavigatorComponent {
  constructor(private _router: Router) { }

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
}
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'parametrizador',
        pathMatch: 'full'
    },
    {
        path: 'parametrizador',
        loadComponent: () => import('./parametrizador/parametrizador.component').then(mod => mod.ParametrizadorComponent),
        title: "Parametrizador"
    }
];

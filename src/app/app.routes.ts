import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
        path: '',
        component: AppComponent,
        title: "App Componnet"
    },
    {
        path: 'parametrizador',
        loadComponent: () => import('./parametrizador/parametrizador.component').then(mod => mod.ParametrizadorComponent),
        title: "Parametrizador"
    }
];

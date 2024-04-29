import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'parametrizador',
        pathMatch: 'full'
    },
    {
        path: 'segmentos',
        loadComponent: () => import('./segmentos/segmentos.component').then(mod => mod.SegmentosComponent),
        title: "Segmentos"
    },
    {
        path: 'clusters',
        loadComponent: () => import('./clusters/clusters.component').then(mod => mod.ClustersComponent),
        title: "Clusters"
    },
    {
        path: 'parametrizador',
        loadComponent: () => import('./parametrizador/parametrizador.component').then(mod => mod.ParametrizadorComponent),
        title: "Parametrizador"
    }
];

import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'parametros',
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
        path: 'politicas',
        loadComponent: () => import('./politicas/politicas.component').then(mod => mod.PoliticasComponent),
        title: "Políticas"
    },
    {
        path: 'parametros',
        loadComponent: () => import('./parametros/parametros.component').then(mod => mod.ParametrosComponent),
        title: "Parâmetros"
    },
    {
        path: 'parametrizador',
        loadComponent: () => import('./parametrizador/parametrizador.component').then(mod => mod.ParametrizadorComponent),
        title: "Parametrizador"
    },
    {
        path: 'parametrizador/:parametrizadorID',
        loadComponent: () => import('./parametrizador/parametrizador.component').then(mod => mod.ParametrizadorComponent),
        title: "Parametrizador"
    }
];

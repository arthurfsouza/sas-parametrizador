import { Routes } from '@angular/router';
import { AuthGuard, PermissionGuard } from '../shared/guards';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'parametros',
        pathMatch: 'full'
    },
    {
        path: 'segmentos',
        loadComponent: () => import('./segmentos/segmentos.component').then(mod => mod.SegmentosComponent),
        title: "Segmentos",
        canActivate: [AuthGuard, PermissionGuard],
        data: { roles: ["santander5", "santander4"] }
    },
    {
        path: 'clusters',
        loadComponent: () => import('./clusters/clusters.component').then(mod => mod.ClustersComponent),
        title: "Clusters",
        canActivate: [AuthGuard, PermissionGuard],
        data: { roles: ["santander5", "santander4"] }
    },
    {
        path: 'politicas',
        loadComponent: () => import('./politicas/politicas.component').then(mod => mod.PoliticasComponent),
        title: "Políticas",
        canActivate: [AuthGuard, PermissionGuard],
        data: { roles: ["santander5", "santander4"] }
    },
    {
        path: 'parametros',
        loadComponent: () => import('./parametros/parametros.component').then(mod => mod.ParametrosComponent),
        title: "Parâmetros",
        canActivate: [AuthGuard, PermissionGuard],
        data: { roles: ["santander5", "santander1"] }
    },
    {
        path: 'parametrizador',
        loadComponent: () => import('./parametrizador/parametrizador.component').then(mod => mod.ParametrizadorComponent),
        title: "Parametrizador",
        canActivate: [AuthGuard, PermissionGuard],
        data: { roles: ["santander5", "santander1"] }
    },
    {
        path: 'parametrizador/:parametrizadorID',
        loadComponent: () => import('./parametrizador/parametrizador.component').then(mod => mod.ParametrizadorComponent),
        title: "Parametrizador",
        canActivate: [AuthGuard, PermissionGuard],
        data: { roles: ["santander5", "santander1"] }
    },
    {
        path: 'error/:error',
        loadComponent: () => import('../shared/components/errors/errors.component').then(mod => mod.ErrorsComponent),
        title: "Erro"
    },
    {
        path: '**',
        loadComponent: () => import('../shared/components/errors/errors.component').then(mod => mod.ErrorsComponent),
        title: "Erro"
    }
];
import { Routes } from '@angular/router';
import { SitesComponent } from './sites.component';
import { canActivatePage } from 'app/guards/permission.guard';

export default [
    {
        path: '',
        component: SitesComponent,
        canActivate: [canActivatePage],
        data: {
            requiredPermission: 'sites.read',
        },
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./site/site.component').then((m) => m.SiteComponent),
        children: [
            {
                path: 'general-details',
                loadComponent: () =>
                    import(
                        './site/general-details/general-details.component'
                    ).then((m) => m.GeneralDetailsComponent),
            },
            {
                path: 'map-view',
                loadComponent: () =>
                    import('./site/map-view/map-view.component').then(
                        (m) => m.MapViewComponent
                    ),
            },
            {
                path: 'documentation',
                loadChildren: () =>
                    import('./site/documentation/documentation.routes'),
            },
        ],
    },
] as Routes;

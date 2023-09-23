import { Routes } from '@angular/router';
import { SitesComponent } from './sites.component';

export default [
    {
        path: '',
        component: SitesComponent,
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
                    import('./site/file-manager/file-manager.routes'),
            },
        ],
    },
] as Routes;

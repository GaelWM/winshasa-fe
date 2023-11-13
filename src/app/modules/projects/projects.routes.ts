import { Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { canActivatePage } from 'app/guards/permission.guard';

export default [
    {
        path: '',
        component: ProjectsComponent,
        canActivate: [canActivatePage],
        data: {
            requiredPermission: 'projects.read',
        },
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./project/project.component').then(
                (m) => m.ProjectComponent
            ),
        children: [
            {
                path: 'general-details',
                loadComponent: () =>
                    import(
                        './project/general-details/general-details.component'
                    ).then((m) => m.GeneralDetailsComponent),
            },
            {
                path: 'documentation',
                loadChildren: () =>
                    import('./project/documentation/documentation.routes'),
            },
        ],
    },
] as Routes;

import { Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';

export default [
    {
        path: '',
        component: ProjectsComponent,
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

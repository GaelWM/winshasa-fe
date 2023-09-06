import { Routes } from '@angular/router';
import { ProductsComponent } from './products.component';

export default [
    {
        path: '',
        component: ProductsComponent,
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./product/product.component').then(
                (m) => m.ProductComponent
            ),
        children: [
            {
                path: 'general-details',
                loadComponent: () =>
                    import(
                        './product/general-details/general-details.component'
                    ).then((c) => c.GeneralDetailsComponent),
            },

            // {
            //     path: 'documentation',
            //     loadChildren: () =>
            //         import(
            //             'app/modules/products/product/file-manager/file-manager.module'
            //         ).then((m) => m.FileManagerModule),
            // },
        ],
    },
] as Routes;

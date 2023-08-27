import { Route } from '@angular/router';
import { FileManagerDetailsComponent } from './details/details.component';
import { FileManagerComponent } from './file-manager.component';
import { CanDeactivateFileManagerDetails } from './file-manager.guards';
import {
    FileManagerFolderResolver,
    FileManagerItemResolver,
    FileManagerItemsResolver,
} from '../../../../resolvers/file-manager.resolvers';
import { FileManagerListComponent } from './list/list.component';

export const fileManagerRoutes: Route[] = [
    {
        path: '',
        component: FileManagerComponent,
        children: [
            {
                path: 'folders/:folderId',
                component: FileManagerListComponent,
                resolve: {
                    item: FileManagerFolderResolver,
                },
                children: [
                    {
                        path: 'details/:id',
                        component: FileManagerDetailsComponent,
                        resolve: {
                            item: FileManagerItemResolver,
                        },
                        canDeactivate: [CanDeactivateFileManagerDetails],
                    },
                ],
            },
            {
                path: '',
                component: FileManagerListComponent,
                resolve: {
                    items: FileManagerItemsResolver,
                },
                children: [
                    {
                        path: 'details/:id',
                        component: FileManagerDetailsComponent,
                        resolve: {
                            item: FileManagerItemResolver,
                        },
                        canDeactivate: [CanDeactivateFileManagerDetails],
                    },
                ],
            },
        ],
    },
];

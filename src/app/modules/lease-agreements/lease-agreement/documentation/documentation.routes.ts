import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { FileManagerService } from 'app/shared/components/file-manager/file-manager.service';
import { DocumentOwnerType } from 'app/shared/components/file-manager/file-manager.types';
import { FileManagerDetailsComponent } from 'app/shared/components/file-manager/details/details.component';
import { FileManagerListComponent } from 'app/shared/components/file-manager/list/list.component';
import { LeaseDocumentationComponent } from './documentation.component';
import { LeaseAgreementsService } from 'app/services/lease-agreements.service.';
import { LeaseAgreement } from 'app/shared/models';

/**
 * Folder resolver
 *
 * @param route
 * @param state
 */
const folderResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const fileManagerService = inject(FileManagerService);
    const router = inject(Router);
    const leaseAgreementId = route.params.id;
    const folderId = route.params.folderId;

    return fileManagerService
        .getItems(folderId, leaseAgreementId, DocumentOwnerType.LEASE)
        .pipe(
            // Error here means the requested folder is not available
            catchError((error) => {
                // Log the error
                console.error(error);

                // Get the parent url
                const parentUrl = state.url.split('/').slice(0, -1).join('/');

                // Navigate to there
                router.navigateByUrl(parentUrl);

                // Throw an error
                return throwError(() => error);
            })
        );
};

/**
 * Item resolver
 *
 * @param route
 * @param state
 */
const itemResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const fileManagerService = inject(FileManagerService);
    const router = inject(Router);

    return fileManagerService.getItemById(route.paramMap.get('id')).pipe(
        // Error here means the requested item is not available
        catchError((error) => {
            // Log the error
            console.error(error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        })
    );
};

/**
 * Can deactivate file manager details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateFileManagerDetails = (
    component: FileManagerDetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/file-manager'
    // it means we are navigating away from the
    // file manager app
    if (!nextState.url.includes('/documentation')) {
        // Let it navigate
        return true;
    }

    // If we are navigating to another item...
    if (nextState.url.includes('/details')) {
        // Just navigate
        return true;
    }

    // Otherwise, close the drawer first, and then navigate
    return component.closeDrawer().then(() => true);
};

/**
 * File manager settings resolver
 *
 * @param route
 * @param state
 */
const settingsResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const leaseAgreementId = route.params.id;
    const leaseAgreementsService = inject(LeaseAgreementsService);
    const leaseAgreement = leaseAgreementsService.selectedLeaseAgreement();
    return {
        folderId: route.params.folderId,
        ownerId:
            (leaseAgreement?.data as LeaseAgreement)?.id ?? leaseAgreementId,
        ownerType: DocumentOwnerType.LEASE,
        routePrefix: `lease-agreements/${
            (leaseAgreement?.data as LeaseAgreement)?.id ?? leaseAgreementId
        }/documentation`,
    };
};

export default [
    {
        path: '',
        component: LeaseDocumentationComponent,
        children: [
            {
                path: 'folders/:folderId',
                component: FileManagerListComponent,
                resolve: {
                    item: folderResolver,
                    fileManagerSettings: settingsResolver,
                },
                children: [
                    {
                        path: 'details/:id',
                        component: FileManagerDetailsComponent,
                        resolve: {
                            item: itemResolver,
                            fileManagerSettings: settingsResolver,
                        },
                        canDeactivate: [canDeactivateFileManagerDetails],
                    },
                ],
            },
            {
                path: '',
                component: FileManagerListComponent,
                resolve: {
                    items: (route: ActivatedRouteSnapshot) => {
                        const leaseAgreementId = route.params.id;
                        const leaseAgreementsService = inject(
                            LeaseAgreementsService
                        );
                        const leaseAgreement =
                            leaseAgreementsService.selectedLeaseAgreement();
                        return inject(FileManagerService).getItems(
                            undefined,
                            (leaseAgreement?.data as LeaseAgreement)?.id ??
                                leaseAgreementId,
                            DocumentOwnerType.LEASE
                        );
                    },
                    fileManagerSettings: settingsResolver,
                },
                children: [
                    {
                        path: 'details/:id',
                        component: FileManagerDetailsComponent,
                        resolve: {
                            item: itemResolver,
                            fileManagerSettings: settingsResolver,
                        },
                        canDeactivate: [canDeactivateFileManagerDetails],
                    },
                ],
            },
        ],
    },
] as Routes;

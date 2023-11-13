import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    RouterStateSnapshot,
} from '@angular/router';
import { PermissionsService } from 'app/services/permissions.service';

export const canActivatePage: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const requiredPermission: string | string[] =
        route.data?.requiredPermission;
    const permissionsService = inject(PermissionsService);

    return permissionsService.hasPermission(requiredPermission);
};

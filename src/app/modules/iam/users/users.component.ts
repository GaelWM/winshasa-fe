import {
    Component,
    DestroyRef,
    TemplateRef,
    ViewChild,
    effect,
    inject,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UserService } from 'app/services/user.service';
import {
    toObservable,
    takeUntilDestroyed,
    toSignal,
} from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ColumnSetting } from 'app/shared/components/win-table/win-table.model';
import { ApiResult, User, IUser } from 'app/shared/models';
import { IsActivePipe } from 'app/shared/pipes/is-active/is-active.pipe';
import { toWritableSignal } from 'app/shared/utils/common.util';
import { Observable, switchMap, map } from 'rxjs';
import { UserFormComponent } from './user-form/user-form.component';
import { WinTableComponent } from 'app/shared/components/win-table/win-table.component';
import { WinPaginatorComponent } from 'app/shared/components/win-paginator/win-paginator.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
        CommonModule,
        WinTableComponent,
        WinPaginatorComponent,
        MatButtonModule,
        MatIconModule,
        RouterModule,
    ],
    templateUrl: './users.component.html',
})
export class UsersComponent {
    private _usersService = inject(UserService);
    private _router = inject(Router);
    private _route = inject(ActivatedRoute);
    private _dialog = inject(MatDialog);
    private _fuseConfirmationService = inject(FuseConfirmationService);
    private destroyRef = inject(DestroyRef);

    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    private users$: Observable<ApiResult<User[]>> = toObservable(
        this._usersService.queries
    ).pipe(
        switchMap((params) => this._usersService.all<User[]>(params)),
        map((result: ApiResult<User[]>) => {
            if (result.data) {
                this._usersService.users.set(result);
            }
            return result;
        }),
        takeUntilDestroyed()
    );
    users = toWritableSignal(this.users$, {} as ApiResult<User[]>);

    columns: ColumnSetting[] = [];
    user = toSignal(this._usersService.user$, { initialValue: {} as User });

    constructor() {
        effect(() => {
            this.columns = [
                {
                    title: 'First name',
                    key: 'firstName',
                    clickEvent: true,
                    sortKey: 'firstName',
                },
                {
                    title: 'Last name',
                    key: 'lastName',
                    clickEvent: true,
                    sortKey: 'lastName',
                },
                {
                    title: 'Email',
                    key: 'email',
                    clickEvent: true,
                    sortKey: 'email',
                },
                {
                    title: 'Phone',
                    key: 'phone',
                    clickEvent: true,
                    sortKey: 'phone',
                },
                {
                    title: 'Address',
                    key: 'address',
                    clickEvent: true,
                    sortKey: 'address',
                },
                {
                    title: 'Active',
                    key: 'isActive',
                    pipe: { class: { obj: IsActivePipe } },
                },
                {
                    title: 'Last Connected',
                    key: 'lastConnected',
                    clickEvent: true,
                    sortKey: 'lastConnected',
                    pipe: {
                        class: { obj: DatePipe, constructor: 'en-US' },
                        args: 'y-MM-dd, hh:mm:ss',
                    },
                },
                {
                    title: 'Created At',
                    key: 'createdAt',
                    clickEvent: true,
                    sortKey: 'address',
                    pipe: {
                        class: { obj: DatePipe, constructor: 'en-US' },
                        args: 'y-MM-dd, hh:mm:ss',
                    },
                },
                {
                    title: 'Updated At',
                    key: 'updatedAt',
                    clickEvent: true,
                    sortKey: 'updatedAt',
                    pipe: {
                        class: { obj: DatePipe, constructor: 'en-US' },
                        args: 'y-MM-dd, hh:mm:ss',
                    },
                },
                { title: 'Actions', key: 'action', template: this.actionsTpl },
            ];
        });
    }

    onPageChange(event: PageEvent) {
        this._router.navigate([], {
            queryParams: {
                page: event.pageIndex + 1,
                perPage: event.pageSize,
            },
            queryParamsHandling: 'merge',
        });
    }

    onSort(event: ColumnSetting): void {
        this._router.navigate([], {
            queryParams: {
                sortBy: event.sortKey,
                sortOrder: event.sortOrder,
            },
            queryParamsHandling: 'merge',
            relativeTo: this._route,
        });
    }

    onRowClick(user: User): void {
        this.onEditUser(undefined, user);
    }

    onAddUser(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this._dialog.open(UserFormComponent, {
            data: {
                title: 'Add new user',
                action: 'add',
            },
        });
    }

    onEditUser(event: Event, user: User) {
        event?.preventDefault();
        event?.stopPropagation();
        this._dialog.open(UserFormComponent, {
            data: {
                title: 'Edit  user',
                user: user,
                action: 'edit',
            },
        });
    }

    onDeleteUser(event: Event, user: IUser) {
        event.preventDefault();
        event.stopPropagation();

        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete user',
            message:
                'Are you sure you want to delete this user and its groups and fields? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._usersService
                    .deleteUser(user.id)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe();
            }
        });
    }
}

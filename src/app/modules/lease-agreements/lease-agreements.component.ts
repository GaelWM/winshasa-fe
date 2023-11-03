import {
    Component,
    DestroyRef,
    TemplateRef,
    ViewChild,
    effect,
    inject,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ToolbarComponent } from 'app/shared/components/toolbar/toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ColumnSetting } from 'app/shared/components/win-table/win-table.model';
import {
    takeUntilDestroyed,
    toObservable,
    toSignal,
} from '@angular/core/rxjs-interop';
import { UserService } from 'app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WinPaginatorComponent } from 'app/shared/components/win-paginator/win-paginator.component';
import { PageEvent } from '@angular/material/paginator';
import {
    ApiResult,
    ILeaseAgreement,
    LeaseAgreement,
    User,
} from 'app/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { LeaseAgreementFormComponent } from './lease-agreement-form/lease-agreement-form.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { IsActivePipe } from 'app/shared/pipes/is-active/is-active.pipe';
import { WinTableComponent } from 'app/shared/components/win-table/win-table.component';
import { Observable, map, switchMap } from 'rxjs';
import { toWritableSignal } from 'app/shared/utils/common.util';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LeaseAgreementsService } from 'app/services/lease-agreements.service.';
import { LeaseAgreementComponent } from './lease-agreement/lease-agreement.component';
import { ModalTemplateComponent } from 'app/shared/components/modal-template/modal-template.component';

@Component({
    selector: 'app-lease-agreement',
    standalone: true,
    imports: [
        CommonModule,
        ToolbarComponent,
        MatButtonModule,
        MatIconModule,
        WinTableComponent,
        WinPaginatorComponent,
        IsActivePipe,
        MatTooltipModule,
        LeaseAgreementFormComponent,
        ModalTemplateComponent,
    ],
    templateUrl: './lease-agreements.component.html',
})
export class LeaseAgreementsComponent {
    #userService = inject(UserService);
    #leaseService = inject(LeaseAgreementsService);
    #router = inject(Router);
    #route = inject(ActivatedRoute);
    #dialog = inject(MatDialog);
    #fuseConfirmationService = inject(FuseConfirmationService);
    #destroyRef = inject(DestroyRef);

    showModal = false;

    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    #leaseAgreements$: Observable<ApiResult<LeaseAgreement[]>> = toObservable(
        this.#leaseService.queries
    ).pipe(
        switchMap((params) => this.#leaseService.all<LeaseAgreement[]>(params)),
        map((result: ApiResult<LeaseAgreement[]>) => {
            if (result.data) {
                this.#leaseService.leaseAgreements.set(result);
            }
            return result;
        }),
        takeUntilDestroyed()
    );
    leaseAgreements = toWritableSignal(
        this.#leaseAgreements$,
        {} as ApiResult<LeaseAgreement[]>
    );

    columns: ColumnSetting[] = [];
    user = toSignal(this.#userService.user$, { initialValue: {} as User });

    constructor() {
        effect(() => {
            this.columns = [
                {
                    title: 'Type',
                    key: 'type',
                    clickEvent: true,
                    sortKey: 'type',
                },
                {
                    title: 'Status',
                    key: 'status',
                    clickEvent: true,
                    sortKey: 'status',
                },
                {
                    title: 'Property Type',
                    key: 'propertyType',
                    clickEvent: true,
                    sortKey: 'propertyType',
                },
                {
                    title: 'Start Date',
                    key: 'startDate',
                    clickEvent: true,
                    sortKey: 'startDate',
                    pipe: {
                        class: {
                            obj: DatePipe,
                            constructor: 'en-US',
                        },
                        args: 'yyyy-MM-dd',
                    },
                },
                {
                    title: 'End Date',
                    key: 'endDate',
                    clickEvent: true,
                    sortKey: 'endDate',
                    pipe: {
                        class: {
                            obj: DatePipe,
                            constructor: 'en-US',
                        },
                        args: 'yyyy-MM-dd',
                    },
                },
                {
                    title: 'Created At',
                    key: 'createdAt',
                    clickEvent: true,
                    sortKey: 'createdAt',
                    pipe: {
                        class: {
                            obj: DatePipe,
                            constructor: 'en-US',
                        },
                        args: 'yyyy-MM-dd HH:mm:ss',
                    },
                },
                {
                    title: 'Updated At',
                    key: 'updatedAt',
                    clickEvent: true,
                    sortKey: 'updatedAt',
                    pipe: {
                        class: {
                            obj: DatePipe,
                            constructor: 'en-US',
                        },
                        args: 'yyyy-MM-dd HH:mm:ss',
                    },
                },
                { title: 'Actions', key: 'action', template: this.actionsTpl },
            ];
        });
    }

    onPageChange(event: PageEvent) {
        this.#router.navigate([], {
            queryParams: {
                page: event.pageIndex + 1,
                perPage: event.pageSize,
            },
            queryParamsHandling: 'merge',
        });
    }

    onSort(event: ColumnSetting): void {
        this.#router.navigate([], {
            queryParams: { orderBy: `${event.sortKey}:${event.sortOrder}` },
            queryParamsHandling: 'merge',
            relativeTo: this.#route,
        });
    }

    onRowClick(leaseAgreement: LeaseAgreement): void {
        this.#leaseService.selectedLeaseAgreement.set({ data: leaseAgreement });
        this.#router.navigate([leaseAgreement.id, 'general-details'], {
            relativeTo: this.#route,
            state: { leaseAgreement },
        });
    }

    onAddLeaseAgreement(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.#leaseService.selectedLeaseAgreement.set({ data: null });
        this.#dialog.open(ModalTemplateComponent, {
            width: '1000px',
            data: {
                form: LeaseAgreementFormComponent,
                title: 'Add Lease Agreement',
            },
        });
    }

    onEditLeaseAgreement(event: Event, leaseAgreement: LeaseAgreement) {
        event.preventDefault();
        event.stopPropagation();
        this.#router.navigate([leaseAgreement.id, 'general-details'], {
            relativeTo: this.#route,
            state: { leaseAgreement },
        });
    }

    onDeleteLeaseAgreement(event: Event, leaseAgreement: ILeaseAgreement) {
        event.preventDefault();
        event.stopPropagation();

        const confirmation = this.#fuseConfirmationService.open({
            title: 'Delete lease agreement',
            message:
                'Are you sure you want to delete this lease agreement and its groups and fields? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.#leaseService
                    .deleteLeaseAgreement(leaseAgreement.id)
                    .pipe(takeUntilDestroyed(this.#destroyRef))
                    .subscribe();
            }
        });
    }
}

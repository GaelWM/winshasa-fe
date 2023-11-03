import {
    AsyncPipe,
    CurrencyPipe,
    DatePipe,
    DOCUMENT,
    formatDate,
    I18nPluralPipe,
    NgClass,
    NgFor,
    NgIf,
} from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    WritableSignal,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import {
    ActivatedRoute,
    Router,
    RouterLink,
    RouterOutlet,
} from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { PaymentsService } from 'app/services/payments.service';
import {
    ApiResult,
    FormError,
    Payment,
    PaymentMethod,
    PaymentStatus,
} from 'app/shared/models';
import { CurrencySymbolPipe } from 'app/shared/pipes/currency-symbol/currency-symbol.pipe';
import { toWritableSignal } from 'app/shared/utils/common.util';

import { filter, fromEvent, map, Observable, switchMap } from 'rxjs';

@Component({
    selector: 'payments-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatSidenavModule,
        RouterOutlet,
        NgIf,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        NgFor,
        NgClass,
        DatePipe,
        RouterLink,
        AsyncPipe,
        I18nPluralPipe,
        MatButtonModule,
        CurrencyPipe,
        CurrencySymbolPipe,
    ],
})
export class PaymentsListComponent implements OnInit {
    #activatedRoute = inject(ActivatedRoute);
    #changeDetectorRef = inject(ChangeDetectorRef);
    #paymentsService = inject(PaymentsService);
    #document = inject(DOCUMENT) as any;
    #router = inject(Router);
    #fuseMediaWatcherService = inject(FuseMediaWatcherService);
    #fuseConfirmationService = inject(FuseConfirmationService);
    #destroyRef = inject(DestroyRef);

    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    errors: WritableSignal<FormError[]> = signal([]);
    $paymentsCount: WritableSignal<{
        totalCount: number;
        totalAmountPerStatus: Record<PaymentStatus, number>;
        countPerStatus: Record<PaymentStatus, number>;
    }> = signal({
        totalAmountPerStatus: {
            [PaymentStatus.FAILED]: 0,
            [PaymentStatus.OVERDUE]: 0,
            [PaymentStatus.PENDING]: 0,
            [PaymentStatus.PAID]: 0,
        },
        countPerStatus: {
            [PaymentStatus.FAILED]: 0,
            [PaymentStatus.OVERDUE]: 0,
            [PaymentStatus.PENDING]: 0,
            [PaymentStatus.PAID]: 0,
        },
        totalCount: 0,
    });
    #payments$: Observable<ApiResult<Payment[]>> = toObservable(
        this.#paymentsService.queries
    ).pipe(
        switchMap((params) =>
            this.#paymentsService.all<Payment[]>({
                ...params,
                perPage: 100,
                orderBy: 'status:desc',
            })
        ),
        map((result: ApiResult<Payment[]>) => {
            if (result.data) {
                // order results by status following this order: failed, overdue, pending, paid
                result.data.sort((a, b) => {
                    if (a.status === b.status) {
                        return 0;
                    }
                    if (a.status === PaymentStatus.FAILED) {
                        return -1;
                    }
                    if (a.status === PaymentStatus.OVERDUE) {
                        return -1;
                    }
                    if (a.status === PaymentStatus.PENDING) {
                        return -1;
                    }
                    if (a.status === PaymentStatus.PAID) {
                        return 1;
                    }
                });

                // calculate total amount and count per status
                const totalAmountPerStatus = {
                    [PaymentStatus.FAILED]: 0,
                    [PaymentStatus.OVERDUE]: 0,
                    [PaymentStatus.PENDING]: 0,
                    [PaymentStatus.PAID]: 0,
                };

                const countPerStatus = {
                    [PaymentStatus.FAILED]: 0,
                    [PaymentStatus.OVERDUE]: 0,
                    [PaymentStatus.PENDING]: 0,
                    [PaymentStatus.PAID]: 0,
                };

                result.data.forEach((payment) => {
                    totalAmountPerStatus[payment.status] += payment.amount;
                    countPerStatus[payment.status] += 1;
                });
                this.#paymentsService.payments.set(result);
                this.$paymentsCount.set({
                    totalAmountPerStatus,
                    countPerStatus,
                    totalCount: result.data.length,
                });
            }
            return result;
        }),
        takeUntilDestroyed()
    );
    $payments = toWritableSignal(this.#payments$, {} as ApiResult<Payment[]>);
    $selectedPayment: WritableSignal<ApiResult<Payment>> =
        this.#paymentsService.selectedPayment;

    PaymentStatus = PaymentStatus;
    PaymentMethod = PaymentMethod;
    color: ThemePalette;

    paymentsTableColumns: string[] = ['name', 'email', 'phone', 'job'];
    drawerMode: 'side' | 'over';
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    /**
     * Constructor
     */
    constructor() {}

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((opened) => {
                if (!opened) {
                    // Remove the selected payment when drawer closed
                    this.$selectedPayment.set(null);

                    // Mark for check
                    this.#changeDetectorRef.markForCheck();
                }
            });

        // Subscribe to media changes
        this.#fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                } else {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this.#changeDetectorRef.markForCheck();
            });

        // Listen for shortcuts
        fromEvent(this.#document, 'keydown')
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                filter<KeyboardEvent>(
                    (event) =>
                        (event.ctrlKey === true || event.metaKey) && // Ctrl or Cmd
                        event.key === '/' // '/'
                )
            )
            .subscribe(() => {
                this.createPayment();
            });
    }

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this.#router.navigate(['./'], { relativeTo: this.#activatedRoute });

        // Mark for check
        this.#changeDetectorRef.markForCheck();
    }

    /**
     * Create payment
     */
    createPayment(): void {
        // Create the payment
        // this.#paymentsService.createPayment().subscribe((newPayment) => {
        //     // Go to the new payment
        //     this.#router.navigate(['./', newPayment.id], {
        //         relativeTo: this.#activatedRoute,
        //     });
        //     // Mark for check
        //     this.#changeDetectorRef.markForCheck();
        // });
    }

    /**
     * Mark as paid payment
     *
     * @param payment
     * @returns {Promise<void>}
     */
    markAsPaidPayment(event: Event, payment: Payment): void {
        event.stopPropagation();
        event.preventDefault();
        const confirmation = this.#fuseConfirmationService.open({
            title: 'Mark as Paid',
            message:
                'Are you sure you want to mark this payment as paid? This action cannot be undone.',
            actions: {
                confirm: {
                    label: 'Mark as Paid',
                },
            },
        });

        confirmation
            .afterClosed()
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((result) => {
                if (result === 'confirmed') {
                    this.#paymentsService
                        .updatePayment(payment.id, {
                            ...payment,
                            status: PaymentStatus.PAID,
                            paymentDate: formatDate(
                                new Date(),
                                'yyyy-MM-dd',
                                'en-US'
                            ),
                        })
                        .pipe(takeUntilDestroyed(this.#destroyRef))
                        .subscribe({
                            error: (err) => {
                                if (err?.error) {
                                    this.errors.set([
                                        { message: err?.error?.message },
                                    ]);
                                }
                                if (err?.error?.errors) {
                                    this.errors.set(err?.error?.errors);
                                }
                            },
                        });
                }
            });
    }

    payPayment(event: Event, payment: Payment): void {
        event.stopPropagation();
        event.preventDefault();
        // Make payment
        // this._paymentsService.makePayment(payment.id).subscribe();
    }

    /**
     * Delete payment
     *
     * @param payment
     * @returns {Promise<void>}
     */
    deletePayment(payment: Payment): void {
        event.stopPropagation();
        event.preventDefault();
        const confirmation = this.#fuseConfirmationService.open({
            title: 'Delete payment',
            message:
                'Are you sure you want to delete this payment? This action cannot be undone.',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        confirmation
            .afterClosed()
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((result) => {
                if (result === 'confirmed') {
                    this.#paymentsService
                        .deletePayment(payment.id)
                        .pipe(takeUntilDestroyed(this.#destroyRef))
                        .subscribe({
                            error: (err) => {
                                if (err?.error) {
                                    this.errors.set([
                                        { message: err?.error?.message },
                                    ]);
                                }
                                if (err?.error?.errors) {
                                    this.errors.set(err?.error?.errors);
                                }
                            },
                        });
                }
            });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}

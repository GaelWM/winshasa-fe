import {
    ChangeDetectorRef,
    Component,
    DestroyRef,
    ViewChild,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core';
import {
    AsyncPipe,
    CommonModule,
    CurrencyPipe,
    DOCUMENT,
    I18nPluralPipe,
} from '@angular/common';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import {
    RouterOutlet,
    RouterLink,
    ActivatedRoute,
    Router,
} from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import {
    Observable,
    Subject,
    switchMap,
    map,
    takeUntil,
    fromEvent,
    filter,
    tap,
    catchError,
    of,
} from 'rxjs';
import { PaymentsService } from 'app/services/payments.service';
import {
    ApiResult,
    Payment,
    PaymentMethod,
    PaymentStatus,
} from 'app/shared/models';
import {
    takeUntilDestroyed,
    toObservable,
    toSignal,
} from '@angular/core/rxjs-interop';
import { toWritableSignal } from 'app/shared/utils/common.util';
import { CurrencySymbolPipe } from 'app/shared/pipes/currency-symbol/currency-symbol.pipe';
import { ThemePalette } from '@angular/material/core';

@Component({
    selector: 'app-lease-payment',
    standalone: true,
    imports: [
        CommonModule,
        MatSidenavModule,
        RouterOutlet,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        RouterLink,
        AsyncPipe,
        I18nPluralPipe,
        CurrencySymbolPipe,
        CurrencyPipe,
        MatButtonModule,
    ],
    templateUrl: './lease-payment.component.html',
    styleUrls: ['./lease-payment.component.scss'],
})
export class LeasePaymentComponent {
    #paymentsService = inject(PaymentsService);
    #activatedRoute = inject(ActivatedRoute);
    #changeDetectorRef = inject(ChangeDetectorRef);
    #document = inject(DOCUMENT) as any;
    #router = inject(Router);
    #route = inject(ActivatedRoute);
    #fuseMediaWatcherService = inject(FuseMediaWatcherService);
    #destroyRef = inject(DestroyRef);

    PaymentStatus = PaymentStatus;
    PaymentMethod = PaymentMethod;
    color: ThemePalette;

    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    #payments$: Observable<ApiResult<Payment[]>> = toObservable(
        this.#paymentsService.queries
    ).pipe(
        switchMap((params) => this.#paymentsService.all<Payment[]>(params)),
        map((result: ApiResult<Payment[]>) => {
            if (result.data) {
                this.#paymentsService.payments.set(result);
            }
            return result;
        }),
        takeUntilDestroyed()
    );
    $payments = toWritableSignal(this.#payments$, {} as ApiResult<Payment[]>);

    selectedPayment = this.#paymentsService.selectedPayment;

    paymentCount = computed(() => this.$payments().data?.length ?? 0);

    paymentsTableColumns: string[] = ['name', 'email', 'phone'];
    drawerMode: 'side' | 'over';
    searchInputControl: UntypedFormControl = new UntypedFormControl();

    /**
     * Constructor
     */
    constructor() {
        // effect(
        //     () => {
        //         this.selectedPayment.set(this.paymentTemp());
        //     },
        //     { allowSignalWrites: true }
        // );

        effect(() => {
            this.matDrawer.openedChange
                .pipe(takeUntilDestroyed(this.#destroyRef))
                .subscribe((opened) => {
                    if (!opened) {
                        // Remove the selected payment when drawer closed
                        this.selectedPayment.set({} as ApiResult<Payment>);

                        // Mark for check
                        this.#changeDetectorRef.markForCheck();
                    }
                });
        });

        effect(() => {
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
        });

        effect(() => {
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
        // this._paymentsService.createPayment().subscribe((newPayment) => {
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
     * @param payment
     * @returns {Promise<void>}
     */
    markAsPaidPayment(payment: Payment): void {
        // Mark as paid
        // this._paymentsService.markAsPaidPayment(payment.id).subscribe();
    }

    payPayment(payment: Payment): void {
        // Make payment
        // this._paymentsService.makePayment(payment.id).subscribe();
    }

    /**
     * Delete payment
     * @param payment
     */
    deletePayment(payment: Payment): void {
        // Delete the payment
        // this._paymentsService.deletePayment(payment.id).subscribe(() => {
        //     // Go back to the list
        //     this.#router.navigate(['./'], {
        //         relativeTo: this.#activatedRoute,
        //     });
        //     // Mark for check
        //     this.#changeDetectorRef.markForCheck();
        // });
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

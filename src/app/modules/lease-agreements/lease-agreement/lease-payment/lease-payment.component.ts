import {
    ChangeDetectorRef,
    Component,
    Inject,
    ViewChild,
    computed,
    inject,
} from '@angular/core';
import {
    AsyncPipe,
    CommonModule,
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
import { Contact } from 'app/layout/common/quick-chat/quick-chat.types';
import {
    Observable,
    Subject,
    takeUntil,
    switchMap,
    fromEvent,
    filter,
    map,
} from 'rxjs';
import { PaymentsService } from 'app/services/payments.service';
import { ApiResult, Payment } from 'app/shared/models';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { toWritableSignal } from 'app/shared/utils/common.util';

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
    #fuseMediaWatcherService = inject(FuseMediaWatcherService);

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

    paymentCount = computed(() => this.$payments().data?.length ?? 0);

    contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    drawerMode: 'side' | 'over';
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedContact: Contact;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor() {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    // ngOnInit(): void {
    //     // Get the contacts

    //     this._contactsService.contacts$
    //         .pipe(takeUntil(this._unsubscribeAll))
    //         .subscribe((contacts: Contact[]) => {
    //             // Update the counts
    //             this.contactsCount = contacts.length;

    //             // Mark for check
    //             this.#changeDetectorRef.markForCheck();
    //         });

    //     // Get the contact
    //     this._contactsService.contact$
    //         .pipe(takeUntil(this._unsubscribeAll))
    //         .subscribe((contact: Contact) => {
    //             // Update the selected contact
    //             this.selectedContact = contact;

    //             // Mark for check
    //             this.#changeDetectorRef.markForCheck();
    //         });

    //     // Get the countries
    //     this._contactsService.countries$
    //         .pipe(takeUntil(this._unsubscribeAll))
    //         .subscribe((countries: Country[]) => {
    //             // Update the countries
    //             this.countries = countries;

    //             // Mark for check
    //             this.#changeDetectorRef.markForCheck();
    //         });

    //     // Subscribe to search input field value changes
    //     this.searchInputControl.valueChanges
    //         .pipe(
    //             takeUntil(this._unsubscribeAll),
    //             switchMap((query) =>
    //                 // Search
    //                 this._contactsService.searchContacts(query)
    //             )
    //         )
    //         .subscribe();

    //     // Subscribe to MatDrawer opened change
    //     this.matDrawer.openedChange.subscribe((opened) => {
    //         if (!opened) {
    //             // Remove the selected contact when drawer closed
    //             this.selectedContact = null;

    //             // Mark for check
    //             this.#changeDetectorRef.markForCheck();
    //         }
    //     });

    //     // Subscribe to media changes
    //     this.#fuseMediaWatcherService.onMediaChange$
    //         .pipe(takeUntil(this._unsubscribeAll))
    //         .subscribe(({ matchingAliases }) => {
    //             // Set the drawerMode if the given breakpoint is active
    //             if (matchingAliases.includes('lg')) {
    //                 this.drawerMode = 'side';
    //             } else {
    //                 this.drawerMode = 'over';
    //             }

    //             // Mark for check
    //             this.#changeDetectorRef.markForCheck();
    //         });

    //     // Listen for shortcuts
    //     fromEvent(this.#document, 'keydown')
    //         .pipe(
    //             takeUntil(this._unsubscribeAll),
    //             filter<KeyboardEvent>(
    //                 (event) =>
    //                     (event.ctrlKey === true || event.metaKey) && // Ctrl or Cmd
    //                     event.key === '/' // '/'
    //             )
    //         )
    //         .subscribe(() => {
    //             this.createContact();
    //         });
    // }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

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
     * Create contact
     */
    createPayment(): void {
        // Create the contact
        // this._contactsService.createContact().subscribe((newContact) => {
        //     // Go to the new contact
        //     this.#router.navigate(['./', newContact.id], {
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

import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { TextFieldModule } from '@angular/cdk/text-field';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Renderer2,
    Signal,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
    computed,
    effect,
    inject,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key/find-by-key.pipe';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { PaymentsService } from 'app/services/payments.service';
import { ApiResult, Payment } from 'app/shared/models';
import { PaymentsListComponent } from '../list/list.component';

@Component({
    selector: 'payments-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        MatButtonModule,
        MatTooltipModule,
        RouterLink,
        MatIconModule,
        NgFor,
        FormsModule,
        ReactiveFormsModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        NgClass,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        TextFieldModule,
        FuseFindByKeyPipe,
        DatePipe,
    ],
})
export class PaymentsDetailsComponent {
    #activatedRoute = inject(ActivatedRoute);
    #changeDetectorRef = inject(ChangeDetectorRef);
    #paymentsListComponent = inject(PaymentsListComponent);
    #paymentsService = inject(PaymentsService);
    #formBuilder = inject(UntypedFormBuilder);
    #fuseConfirmationService = inject(FuseConfirmationService);
    #renderer2 = inject(Renderer2);
    #router = inject(Router);
    #overlay = inject(Overlay);
    #viewContainerRef = inject(ViewContainerRef);

    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    editMode: boolean = false;
    $payment: Signal<ApiResult<Payment>> =
        this.#paymentsService.selectedPayment;
    $paymentForm: Signal<UntypedFormGroup> = computed(() => {
        const payment = this.$payment().data as Payment;
        return this.#formBuilder.group({
            id: [payment.id ?? ''],
            ownerId: [payment.ownerId ?? '', [Validators.required]],
            ownerType: [payment.ownerType ?? '', [Validators.required]],
            paymentMethod: [payment.paymentMethod ?? '', [Validators.required]],
            amount: [payment.amount ?? null, [Validators.required]],
            dueDate: [payment.dueDate ?? '', [Validators.required]],
            status: [payment.status ?? '', [Validators.required]],
            notes: [payment.notes ?? ''],
        });
    });

    /**
     * Constructor
     */
    constructor() {
        effect(() => this.#paymentsListComponent.matDrawer.open());
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this.#paymentsListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
        }

        // Mark for check
        this.#changeDetectorRef.markForCheck();
    }

    /**
     * Update the payment
     */
    updatePayment(): void {
        // // Get the payment object
        // const payment = this.paymentForm.getRawValue();
        // // Go through the payment object and clear empty values
        // payment.emails = payment.emails.filter((email) => email.email);
        // payment.phoneNumbers = payment.phoneNumbers.filter(
        //     (phoneNumber) => phoneNumber.phoneNumber
        // );
        // // Update the payment on the server
        // this.#paymentsService
        //     .updatePayment(payment.id, payment)
        //     .subscribe(() => {
        //         // Toggle the edit mode off
        //         this.toggleEditMode(false);
        //     });
    }

    /**
     * Delete the payment
     */
    deletePayment(): void {
        // Open the confirmation dialog
        const confirmation = this.#fuseConfirmationService.open({
            title: 'Delete payment',
            message:
                'Are you sure you want to delete this payment? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        // confirmation.afterClosed().subscribe((result) => {
        //     // If the confirm button pressed...
        //     if (result === 'confirmed') {
        //         // Get the current payment's id
        //         const id = this.payment.id;

        //         // Get the next/previous payment's id
        //         const currentPaymentIndex = this.payments.findIndex(
        //             (item) => item.id === id
        //         );
        //         const nextPaymentIndex =
        //             currentPaymentIndex +
        //             (currentPaymentIndex === this.payments.length - 1 ? -1 : 1);
        //         const nextPaymentId =
        //             this.payments.length === 1 && this.payments[0].id === id
        //                 ? null
        //                 : this.payments[nextPaymentIndex].id;

        //         // Delete the payment
        //         this.#paymentsService
        //             .deletePayment(id)
        //             .subscribe((isDeleted) => {
        //                 // Return if the payment wasn't deleted...
        //                 if (!isDeleted) {
        //                     return;
        //                 }

        //                 // Navigate to the next payment if available
        //                 if (nextPaymentId) {
        //                     this.#router.navigate(['../', nextPaymentId], {
        //                         relativeTo: this.#activatedRoute,
        //                     });
        //                 }
        //                 // Otherwise, navigate to the parent
        //                 else {
        //                     this.#router.navigate(['../'], {
        //                         relativeTo: this.#activatedRoute,
        //                     });
        //                 }

        //                 // Toggle the edit mode off
        //                 this.toggleEditMode(false);
        //             });

        //         // Mark for check
        //         this.#changeDetectorRef.markForCheck();
        //     }
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

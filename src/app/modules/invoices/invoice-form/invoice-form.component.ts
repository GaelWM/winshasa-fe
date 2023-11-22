import { CommonModule, formatDate } from '@angular/common';
import {
    AfterViewInit,
    Component,
    DestroyRef,
    Input,
    ViewChild,
    ViewEncapsulation,
    WritableSignal,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseAlertComponent } from '@fuse/components/alert';
import { InvoicesService } from 'app/services/invoices.service';
import { UserService } from 'app/services/user.service';
import { ErrorFormTemplateComponent } from 'app/shared/components/error-form-template/error-form-template.component';
import { WinFormBuilder } from 'app/shared/components/modal-template/modal-template.component';
import { ModalTemplateService } from 'app/shared/components/modal-template/modal-template.service';
import {
    FormError,
    Invoice,
    Template,
    User,
    PaymentFrequency,
    InvoiceStatus,
    Currency,
} from 'app/shared/models';
import { catchError, map, of } from 'rxjs';
import { JsonFormComponent } from 'app/shared/components/json-form/json-form.component';
import { ToastService } from 'app/shared/components/toast/toast.service';

@Component({
    selector: 'app-invoice-form',
    templateUrl: './invoice-form.component.html',
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        FormsModule,
        MatSelectModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatDatepickerModule,
        FuseAlertComponent,
        MatRadioModule,
        ErrorFormTemplateComponent,
        MatMenuModule,
        MatTooltipModule,
        MatTabsModule,
        JsonFormComponent,
        MatDatepickerModule,
    ],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
})
export class InvoiceFormComponent
    extends WinFormBuilder
    implements AfterViewInit
{
    #formBuilder = inject(FormBuilder);
    #userService = inject(UserService);
    #invoiceService = inject(InvoicesService);
    #modalService = inject(ModalTemplateService);
    #destroyRef = inject(DestroyRef);
    #toastService = inject(ToastService);

    @Input() showSaveButton = false;
    @Input() asModal = false;

    @ViewChild('invoiceNgForm') _form: NgForm;
    form: NgForm = {} as NgForm;

    formFieldHelpers: string = '';
    submitted: boolean = false;
    paymentFrequency = PaymentFrequency;
    paymentFrequencyOpts = Object.values(PaymentFrequency);
    invoiceStatusOpts = Object.values(InvoiceStatus);
    currencyOpts = Object.values(Currency);

    errors: WritableSignal<FormError[]> = signal([]);
    $invoice = this.#invoiceService.selectedInvoice;
    $invoiceForm = computed(() => {
        const invoice = this.#invoiceService.selectedInvoice().data as Invoice;

        return this.#formBuilder.group({
            id: [invoice?.id ?? ''],
            ownerId: [invoice?.ownerId ?? ''],
            ownerType: [invoice?.ownerType ?? ''],
            invoiceNumber: [invoice?.invoiceNumber ?? ''],
            invoiceDate: [invoice?.invoiceDate ?? ''],
            invoiceStatus: [invoice?.invoiceStatus ?? ''],
            dueDate: [invoice?.dueDate ?? ''],
            customerId: [invoice?.customerId ?? ''],
            customerName: [invoice?.customerName ?? ''],
            customerEmail: [invoice?.customerEmail ?? ''],
            billingAddress: [invoice?.billingAddress ?? ''],
            billingContact: [invoice?.billingContact ?? ''],
            shippingAddress: [invoice?.shippingAddress ?? ''],
            totalAmount: [invoice?.totalAmount ?? ''],
            taxAmount: [invoice?.taxAmount ?? ''],
            discountAmount: [invoice?.discountAmount ?? ''],
            grandTotal: [invoice?.grandTotal ?? ''],
            currency: [invoice?.currency ?? ''],
            notes: [invoice?.notes ?? ''],
            generateBy: [invoice?.generateBy ?? ''],
            details: this.#formBuilder.group({}),
        });
    });

    $selectedTemplate: WritableSignal<Template | undefined> = signal(
        {} as Template
    );

    #users$ = this.#userService.getUsersWithRole('landlord,tenant').pipe(
        takeUntilDestroyed(),
        map((d) => d.data as User[]),
        catchError(() => of([] as User[]))
    );
    $owners = toSignal(this.#users$);

    constructor() {
        super();

        effect(
            () => {
                this.$invoiceForm()
                    .valueChanges.pipe(takeUntilDestroyed(this.#destroyRef))
                    .subscribe((value) => this.onValuesChange(value));
            },
            { allowSignalWrites: true }
        );
        effect(
            () => {
                const invoice = this.#invoiceService.selectedInvoice()
                    .data as Invoice;
                invoice && this.onValuesChange(invoice);
            },
            { allowSignalWrites: true }
        );
    }

    ngAfterViewInit(): void {
        this.form = this._form;
    }

    onValuesChange(formData: any): void {}

    onSubmitNewInvoice(invoiceForm: NgForm): void {
        this.submitted = true;
        invoiceForm.value.startDate = formatDate(
            invoiceForm.value.startDate,
            'yyyy-MM-dd',
            'en-US'
        );
        invoiceForm.value.endDate = formatDate(
            invoiceForm.value.endDate,
            'yyyy-MM-dd',
            'en-US'
        );

        const invoice = this.#invoiceService.selectedInvoice().data as Invoice;

        if (invoice?.id) {
            this.editInvoice(invoiceForm);
        } else {
            this.addInvoice(invoiceForm);
        }
    }

    private addInvoice(invoiceForm: NgForm): void {
        this.#invoiceService.storeInvoice(invoiceForm.value).subscribe({
            next: () => {
                this.#modalService.closeModal();
                this.#toastService.success('Invoice added successfully!');
            },
            error: (err) => {
                if (err?.error) {
                    this.errors.set([{ message: err?.error?.message }]);
                }
                if (err?.error?.errors) {
                    this.errors.set(err?.error?.errors);
                }
            },
        });
    }

    private editInvoice(invoiceForm: NgForm): void {
        const invoice = this.#invoiceService.selectedInvoice().data as Invoice;
        this.#invoiceService
            .updateInvoice(invoice.id, invoiceForm.value)
            .subscribe({
                next: () => {
                    this.#toastService.success('Invoice updated successfully!');
                },
                error: (err) => {
                    if (err?.error) {
                        this.errors.set([{ message: err?.error?.message }]);
                    }
                    if (err?.error?.errors) {
                        this.errors.set(err?.error?.errors);
                    }
                },
            });
    }
}

import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    DestroyRef,
    Input,
    ViewChild,
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
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseAlertComponent } from '@fuse/components/alert';
import { MetadataService } from 'app/services/metadata.service';
import { ProductsService } from 'app/services/products.service';
import { TemplatesService } from 'app/services/templates.service';
import { ErrorFormTemplateComponent } from 'app/shared/components/error-form-template/error-form-template.component';
import { JsonFormComponent } from 'app/shared/components/json-form/json-form.component';
import { WinFormBuilder } from 'app/shared/components/modal-template/modal-template.component';
import { ModalTemplateService } from 'app/shared/components/modal-template/modal-template.service';
import {
    TOAST_STATE,
    ToastService,
} from 'app/shared/components/toast/toast.service';
import {
    FormError,
    MetadataEntityType,
    Product,
    Template,
    TemplateType,
} from 'app/shared/models';

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
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
        FuseAlertComponent,
        ErrorFormTemplateComponent,
        JsonFormComponent,
    ],
    standalone: true,
})
export class ProductFormComponent
    extends WinFormBuilder
    implements AfterViewInit
{
    #templatesService = inject(TemplatesService);
    #productService = inject(ProductsService);
    #metadataService = inject(MetadataService);
    #formBuilder = inject(FormBuilder);
    #destroyRef = inject(DestroyRef);
    #modalService = inject(ModalTemplateService);
    #toastService = inject(ToastService);

    formFieldHelpers: string = '';
    submitted: boolean = false;
    errors: WritableSignal<FormError[]> = signal([]);

    @Input() showSaveButton = false;
    @Input() asModal = false;

    @ViewChild('productNgForm') _form: NgForm;
    form: NgForm = {} as NgForm;

    $product = this.#productService.selectedProduct;
    $productForm = computed(() => {
        const product = this.#productService.selectedProduct().data as Product;
        return this.#formBuilder.group({
            id: [product?.id ?? ''],
            name: [
                product?.name ?? '',
                [Validators.required, Validators.minLength(2)],
            ],
            type: [product?.type ?? '', [Validators.required]],
            status: [product?.status ?? '', [Validators.required]],
            templateId: [product?.templateId ?? ''],
            category: [product?.category ?? ''],
            isActive: [product?.isActive ?? true],
            details: this.#formBuilder.group({
                description: [product?.details?.description ?? ''],
            }),
        });
    });

    #templates$ = this.#templatesService.all<Template[]>({ perPage: 100 });
    $templates = toSignal(this.#templates$);
    $templateOpts = computed(() => {
        const templates = this.$templates()?.data as Template[];
        return templates
            ?.filter((t) => t.type === TemplateType.PRODUCT)
            .map((t) => ({ id: t.id, name: t.name }));
    });
    $selectedTemplate: WritableSignal<Template | undefined> = signal(
        {} as Template
    );

    $productTypeOpts = this.#metadataService.getComputedOptions(
        'type',
        MetadataEntityType.PRODUCT
    );

    $productStatusOpts = this.#metadataService.getComputedOptions(
        'status',
        MetadataEntityType.PRODUCT
    );

    $productCategoryOpts = this.#metadataService.getComputedOptions(
        'category',
        MetadataEntityType.PRODUCT
    );

    constructor() {
        super();
        effect(
            () => {
                this.$productForm()
                    .valueChanges.pipe(takeUntilDestroyed(this.#destroyRef))
                    .subscribe((value) => this.onValuesChange(value));
            },
            { allowSignalWrites: true }
        );
        effect(
            () => {
                const product = this.#productService.selectedProduct()
                    .data as Product;
                product && this.onValuesChange(product);
            },
            { allowSignalWrites: true }
        );
    }

    ngAfterViewInit(): void {
        this.form = this._form;
    }

    onValuesChange(formData: any): void {
        const template = this.getSelectedTemplate(formData.templateId);
        this.$selectedTemplate.set(template);
    }

    onSubmitNewProduct(productForm: NgForm): void {
        this.submitted = true;
        const product = this.#productService.selectedProduct().data as Product;
        if (product.id) {
            this.editProduct(productForm);
        } else {
            this.addProduct(productForm);
        }
    }

    private getSelectedTemplate(templateId): Template | undefined {
        const templates = this.$templates()?.data as Template[];
        return templates?.find((t) => t.id === templateId);
    }

    private addProduct(productForm: NgForm): void {
        this.#productService.storeProduct(productForm.value).subscribe({
            next: () => {
                this.#modalService.closeModal();
                this.#toastService.showToast(
                    TOAST_STATE.SUCCESS,
                    'Product added successfully'
                );
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

    private editProduct(productForm: NgForm): void {
        const product = this.#productService.selectedProduct().data as Product;
        this.#productService
            .updateProduct(product.id, productForm.value)
            .subscribe({
                next: () => {
                    this.#toastService.showToast(
                        TOAST_STATE.SUCCESS,
                        'Product updated successfully'
                    );
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

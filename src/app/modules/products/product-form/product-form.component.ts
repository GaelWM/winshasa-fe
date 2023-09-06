import { CommonModule } from '@angular/common';
import {
    Component,
    WritableSignal,
    computed,
    inject,
    signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseAlertComponent } from '@fuse/components/alert';
import { MetadataService } from 'app/services/metadata.service';
import { ProductsService } from 'app/services/products.service';
import { TemplatesService } from 'app/services/templates.service';
import { ErrorFormTemplateComponent } from 'app/shared/components/error-form-template/error-form-template.component';
import { FormError, Metadata, Product, Template } from 'app/shared/models';

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
    ],
    standalone: true,
})
export class ProductFormComponent {
    public data = inject(MAT_DIALOG_DATA) as {
        title: string;
        product: Product;
        action: string;
    };
    public dialogRef = inject(MatDialogRef<ProductFormComponent>);
    private _templatesService = inject(TemplatesService);
    private _productService = inject(ProductsService);
    private _metadataService = inject(MetadataService);
    private _formBuilder = inject(FormBuilder);

    formFieldHelpers: string = '';
    submitted: boolean = false;
    errors: WritableSignal<FormError[]> = signal([]);

    productForm = computed(() => {
        const product = this.data.product;
        return this._formBuilder.group({
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
            details: this._formBuilder.group({
                description: [product?.details?.description ?? ''],
            }),
        });
    });

    templates$ = this._templatesService.all<Template[]>({ perPage: 100 });
    templates = toSignal(this.templates$);

    metadata$ = this._metadataService.all<Metadata[]>({ perPage: 100 });
    metadata = toSignal(this.metadata$);

    templateOptions = computed(() => {
        const templates = this.templates()?.data as Template[];
        return templates
            ?.filter((t) => t.type === 'Product')
            .map((t) => ({
                id: t.id,
                name: t.name,
            }));
    });

    productTypeOptions = computed(() => {
        const metadata = this.metadata()?.data as Metadata[];
        return metadata
            ?.filter((t) => t.type === 'type' && t.entity === 'Product')
            .map((t) => ({
                id: t.id,
                name: t.value,
            }));
    });

    productStatusOptions = computed(() => {
        const metadata = this.metadata()?.data as Metadata[];
        return metadata
            ?.filter((t) => t.type === 'status' && t.entity === 'Product')
            .map((t) => ({
                id: t.id,
                name: t.value,
            }));
    });

    onSubmitNewProduct(productForm: NgForm): void {
        this.submitted = true;
        if (this.data.action === 'edit' && this.data.product.id) {
            this.editProduct(productForm);
        } else {
            this.addProduct(productForm);
        }
    }

    private addProduct(productForm: NgForm): void {
        this._productService.storeProduct(productForm.value).subscribe({
            next: () => {
                this.dialogRef.close();
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
        this._productService
            .updateProduct(this.data.product.id, productForm.value)
            .subscribe({
                next: () => {
                    this.dialogRef.close();
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

    onCloseModal(event: Event): void {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.dialogRef.close('modal closed');
    }
}

import { CommonModule } from '@angular/common';
import {
    Component,
    computed,
    DestroyRef,
    inject,
    signal,
    ViewChild,
    WritableSignal,
} from '@angular/core';
import {
    takeUntilDestroyed,
    toObservable,
    toSignal,
} from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseAlertComponent } from '@fuse/components/alert';
import { MetadataService } from 'app/services/metadata.service';
import { ProductsService } from 'app/services/products.service';
import { TemplatesService } from 'app/services/templates.service';
import { JsonFormFirstColDirective } from 'app/shared/components/json-form/json-form-first-item.directive';
import { JsonFormComponent } from 'app/shared/components/json-form/json-form.component';
import {
    ApiResult,
    FormError,
    Metadata,
    Product,
    Template,
} from 'app/shared/models';
import { Observable, switchMap, catchError, of, filter } from 'rxjs';

@Component({
    selector: 'app-general-details',
    templateUrl: './general-details.component.html',
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        JsonFormComponent,
        MatExpansionModule,
        JsonFormFirstColDirective,
        MatSelectModule,
        FuseAlertComponent,
    ],
    standalone: true,
})
export class GeneralDetailsComponent {
    private _productService = inject(ProductsService);
    private _templateService = inject(TemplatesService);
    private fb = inject(FormBuilder);
    private _metadataService = inject(MetadataService);
    private destroyRef = inject(DestroyRef);

    @ViewChild('productNgForm') _form: NgForm;

    errors: WritableSignal<FormError[]> = signal([]);

    product = this._productService.selectedProduct;
    productForm = computed(() => {
        const product = this.product().data as Product;
        return this.fb.group({
            id: [product?.id],
            name: [product?.name, Validators.required],
            templateId: [product?.templateId],
            status: [product?.status, Validators.required],
            type: [product?.type, Validators.required],
            category: [product?.category],
            details: this.fb.group({}),
        });
    });

    private template$: Observable<ApiResult<Template>> = toObservable(
        this.product
    ).pipe(
        switchMap((product) =>
            this._templateService.get<Template>(
                (product.data as Product).templateId
            )
        ),
        catchError(() => of(undefined)),
        takeUntilDestroyed()
    );
    template = toSignal(this.template$, {
        initialValue: {} as ApiResult<Template>,
    });

    typeOptions = computed(() => {
        const metadata = this._metadataService.metadata()?.data as Metadata[];
        return metadata
            ?.filter((t) => t.type === 'type' && t.entity === 'Product')
            .map((t) => ({
                id: t.id,
                name: t.value,
            }));
    });
    statusOptions = computed(() => {
        const metadata = this._metadataService.metadata()?.data as Metadata[];
        return metadata
            ?.filter((t) => t.type === 'status' && t.entity === 'Product')
            .map((t) => ({
                id: t.id,
                name: t.value,
            }));
    });

    categoryOptions = computed(() => {
        const metadata = this._metadataService.metadata()?.data as Metadata[];
        return metadata
            ?.filter((t) => t.type === 'category' && t.entity === 'Product')
            .map((t) => ({
                id: t.id,
                name: t.value,
            }));
    });

    constructor() {
        this._productService
            .onProductFormSubmit()
            .pipe(
                filter((submit) => submit),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                this.errors.set([]);
                this._form && this._form.ngSubmit.emit();
            });
    }

    onSaveProduct(productForm: NgForm): void {
        const product = productForm.form.value;
        this._productService
            .updateProduct(product.id, product)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                error: (err) => {
                    if (err?.error) {
                        this.errors.set([{ message: err?.error?.message }]);
                    }
                    if (err?.error?.errors) {
                        this.errors.set(err?.error?.errors);
                    }
                },
                complete: () => {
                    this._productService.submitProductForm(false);
                },
            });
    }
}

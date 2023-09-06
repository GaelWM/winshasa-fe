import { CommonModule } from '@angular/common';
import {
    Component,
    ViewEncapsulation,
    effect,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ThemePalette } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductsService } from 'app/services/products.service';
import { ApiResult, Product } from 'app/shared/models';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        MatTabsModule,
        MatButtonModule,
        RouterModule,
    ],

    standalone: true,
})
export class ProductComponent {
    private _productService = inject(ProductsService);
    private _route = inject(ActivatedRoute);

    background: ThemePalette = 'accent';

    private product$: Observable<ApiResult<Product>> = this._route.params.pipe(
        switchMap((params) => this._productService.get<Product>(params['id'])),
        tap((product: ApiResult<Product>) => {
            if (product) {
                this._productService.selectedProduct.set(product);
            }
        }),
        catchError(() => of(undefined)),
        takeUntilDestroyed()
    );
    productTemp = toSignal(this.product$, {
        initialValue: {} as ApiResult<Product>,
    });

    product = signal({} as ApiResult<Product>);

    constructor() {
        effect(() => {
            this.productTemp();
            this.product = this._productService.selectedProduct;
        });
    }

    onSave(event: Event): void {
        event.preventDefault();
        this._productService.submitProductForm(true);
    }
}

import { Injectable, WritableSignal, signal } from '@angular/core';
import { BaseService } from 'app/services/base.service';
import { ApiResult, Product } from 'app/shared/models';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProductsService extends BaseService {
    constructor() {
        super('products');
    }
    public _submitted: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public onSubmitProductForm$: Observable<any> =
        this._submitted.asObservable();

    products: WritableSignal<ApiResult<Product[]>> = signal(
        {} as ApiResult<Product[]>
    );

    selectedProduct: WritableSignal<ApiResult<Product>> = signal(
        {} as ApiResult<Product>
    );

    onProductFormSubmit(): Observable<boolean> {
        return this.onSubmitProductForm$;
    }

    submitProductForm(flag: boolean): void {
        this._submitted.next(flag);
    }

    storeProduct(payload: Product): Observable<ApiResult<Product>> {
        return this.post<Product>(payload).pipe(
            tap((result) => {
                this.products.update((products: ApiResult<Product[]>) => {
                    products.data = [
                        result.data as Product,
                        ...(products.data as Product[]),
                    ];
                    products.meta.total++;
                    return products;
                });
            })
        );
    }

    updateProduct(
        id: string,
        payload: Product
    ): Observable<ApiResult<Product>> {
        return this.patch<Product>(id, payload).pipe(
            tap((result) => {
                this.selectedProduct.set(result);
            })
        );
    }

    deleteProduct(id: string): Observable<ApiResult<Product>> {
        return this.delete<Product>(id).pipe(
            tap(() => {
                this.products.update((products: ApiResult<Product[]>) => {
                    products.data = (products.data as Product[]).filter(
                        (t: Product) => t.id !== id
                    );
                    products.meta.total--;
                    return products;
                });
            })
        );
    }
}

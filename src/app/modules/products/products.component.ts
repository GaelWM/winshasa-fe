import {
    Component,
    DestroyRef,
    TemplateRef,
    ViewChild,
    effect,
    inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from 'app/shared/components/toolbar/toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ColumnSetting } from 'app/shared/components/win-table/win-table.model';
import {
    takeUntilDestroyed,
    toObservable,
    toSignal,
} from '@angular/core/rxjs-interop';
import { ProductsService } from '../../services/products.service';
import { UserService } from 'app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WinPaginatorComponent } from 'app/shared/components/win-paginator/win-paginator.component';
import { PageEvent } from '@angular/material/paginator';
import { ApiResult, IProduct, Product, User } from 'app/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormComponent } from './product-form/product-form.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { IsActivePipe } from 'app/shared/pipes/is-active/is-active.pipe';
import { WinTableComponent } from 'app/shared/components/win-table/win-table.component';
import { Observable, map, switchMap } from 'rxjs';
import { toWritableSignal } from 'app/shared/utils/common.util';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [
        CommonModule,
        ToolbarComponent,
        MatButtonModule,
        MatIconModule,
        WinTableComponent,
        WinPaginatorComponent,
        IsActivePipe,
        MatTooltipModule,
    ],
    templateUrl: './products.component.html',
})
export class ProductsComponent {
    private _userService = inject(UserService);
    private _productsService = inject(ProductsService);
    private _router = inject(Router);
    private _route = inject(ActivatedRoute);
    private _dialog = inject(MatDialog);
    private _fuseConfirmationService = inject(FuseConfirmationService);
    private destroyRef = inject(DestroyRef);

    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    private products$: Observable<ApiResult<Product[]>> = toObservable(
        this._productsService.queries
    ).pipe(
        switchMap((params) => this._productsService.all<Product[]>(params)),
        map((result: ApiResult<Product[]>) => {
            if (result.data) {
                this._productsService.products.set(result);
            }
            return result;
        }),
        takeUntilDestroyed()
    );
    products = toWritableSignal(this.products$, {} as ApiResult<Product[]>);

    columns: ColumnSetting[] = [];
    user = toSignal(this._userService.user$, { initialValue: {} as User });

    constructor() {
        effect(() => {
            this.columns = [
                {
                    title: 'Name',
                    key: 'name',
                    clickEvent: true,
                    sortKey: 'name',
                },
                {
                    title: 'Type',
                    key: 'type',
                    clickEvent: true,
                    sortKey: 'type',
                },
                {
                    title: 'Status',
                    key: 'status',
                    clickEvent: true,
                    sortKey: 'status',
                },
                {
                    title: 'Category',
                    key: 'category',
                    clickEvent: true,
                    sortKey: 'category',
                },
                {
                    title: 'Active',
                    key: 'isActive',
                    pipe: { class: { obj: IsActivePipe } },
                },
                { title: 'Actions', key: 'action', template: this.actionsTpl },
            ];
        });
    }

    onPageChange(event: PageEvent) {
        this._router.navigate([], {
            queryParams: {
                page: event.pageIndex + 1,
                perPage: event.pageSize,
            },
            queryParamsHandling: 'merge',
        });
    }

    onSort(event: ColumnSetting): void {
        this._router.navigate([], {
            queryParams: {
                sortBy: event.sortKey,
                sortOrder: event.sortOrder,
            },
            queryParamsHandling: 'merge',
            relativeTo: this._route,
        });
    }

    onRowClick(event: Product): void {
        this._router.navigate(['products', event.id, 'general-details']);
    }

    onAddProduct(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this._dialog.open(ProductFormComponent, {
            data: {
                title: 'Add new product',
                action: 'add',
            },
        });
    }

    onEditProduct(event: Event, product: IProduct) {
        event.preventDefault();
        event.stopPropagation();
        this._dialog.open(ProductFormComponent, {
            data: {
                title: 'Edit  product',
                product: product,
                action: 'edit',
            },
        });
    }

    onDeleteProduct(event: Event, product: IProduct) {
        event.preventDefault();
        event.stopPropagation();

        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete product',
            message:
                'Are you sure you want to delete this product and its groups and fields? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._productsService
                    .deleteProduct(product.id)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe();
            }
        });
    }
}

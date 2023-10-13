import { NgFor, NgIf } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    ActivatedRoute,
    Router,
    RouterLink,
    RouterOutlet,
} from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import { FileManagerService } from '../file-manager.service';
import {
    DocumentType,
    DocumentTypeMap,
    Item,
    Items,
} from '../file-manager.types';
import { MatDialog } from '@angular/material/dialog';
import { DocumentFormComponent } from './document-form/document-form.component';

@Component({
    selector: 'file-manager-list',
    templateUrl: './list.component.html',
    styles: ['.mat-mdc-tab-nav-panel { height: 100%; }'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatSidenavModule,
        RouterOutlet,
        NgIf,
        RouterLink,
        NgFor,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
    ],
})
export class FileManagerListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    selectedItem: Item;
    items: Items;
    #dialog = inject(MatDialog);
    #route = inject(ActivatedRoute);

    docType = DocumentType;
    docTypeMap = DocumentTypeMap;
    routePrefix =
        this.#route.snapshot.data['fileManagerSettings']?.routePrefix ?? '';

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fileManagerService: FileManagerService,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the items
        this._fileManagerService.items$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((items: Items) => {
                this.items = items;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the item
        this._fileManagerService.item$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: Item) => {
                this.selectedItem = item;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to media query change
        this._fuseMediaWatcherService
            .onMediaQueryChange$('(min-width: 1440px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {
                // Calculate the drawer mode
                this.drawerMode = state.matches ? 'side' : 'over';

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

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

    onUploadFile(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        const { folderId, ownerId, ownerType } =
            this.#route.snapshot.data['fileManagerSettings'];
        this.#dialog.open(DocumentFormComponent, {
            data: {
                title: 'Upload new file',
                ...(ownerId && { ownerId }),
                ...(ownerType && { ownerType }),
                ...(folderId && { folderId: folderId }),
                action: 'upload',
            },
        });
    }

    onCreateFolder(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        const { folderId, ownerId, ownerType } =
            this.#route.snapshot.data['fileManagerSettings'];
        this.#dialog.open(DocumentFormComponent, {
            data: {
                title: 'Create new folder',
                ...(ownerId && { ownerId }),
                ...(ownerType && { ownerType }),
                ...(folderId && { folderId: folderId }),
                action: 'create-folder',
            },
        });
    }

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
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

import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    map,
    Observable,
    of,
    switchMap,
    take,
    tap,
    throwError,
} from 'rxjs';
import { DocumentOwnerType, Item, Items } from './file-manager.types';
import { BaseService } from 'app/services/base.service';

@Injectable({ providedIn: 'root' })
export class FileManagerService extends BaseService {
    // Private
    private _item: BehaviorSubject<Item | null> = new BehaviorSubject(null);
    private _items: BehaviorSubject<Items | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor() {
        super('document-items');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for items
     */
    get items$(): Observable<Items> {
        return this._items.asObservable();
    }

    /**
     * Getter for item
     */
    get item$(): Observable<Item> {
        return this._item.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get items
     */
    getItems(
        folderId?: string,
        ownerId?: string,
        ownerType?: DocumentOwnerType
    ): Observable<Item[]> {
        return this.all<Items>({
            ...(folderId && { folderId }),
            ...(ownerId && { ownerId }),
            ...(ownerId && ownerType && { ownerType }),
        }).pipe(
            tap((response: any) => {
                this._items.next(response.data as Items);
            })
        );
    }

    /**
     * Get item by id
     */
    getItemById(id: string): Observable<Item> {
        return this._items.pipe(
            take(1),
            map((items) => {
                // Find within the folders and files
                const item =
                    [...items.folders, ...items.files].find(
                        (value) => value.id === id
                    ) || null;

                // Update the item
                this._item.next(item);

                // Return the item
                return item;
            }),
            switchMap((item) => {
                if (!item) {
                    return throwError(
                        () => 'Could not found the item with id of ' + id + '!'
                    );
                }

                return of(item);
            })
        );
    }
}

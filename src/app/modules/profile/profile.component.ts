import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    OnDestroy,
    inject,
} from '@angular/core';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { Subject, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SettingsComponent } from 'app/layout/common/settings/settings.component';
import { MatChipsModule } from '@angular/material/chips';
import { UserService } from 'app/services/user.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { User } from 'app/shared/models';
import { SettingsAccountComponent } from './account/account.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    imports: [
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        SettingsComponent,
        MatChipsModule,
        SettingsAccountComponent,
    ],
    standalone: true,
})
export class ProfileComponent implements OnInit, OnDestroy {
    private _userService = inject(UserService);
    private _changeDetectorRef = inject(ChangeDetectorRef);
    private _fuseMediaWatcherService = inject(FuseMediaWatcherService);

    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'user-info';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    user = toSignal(this._userService.user$, { initialValue: {} as User });

    /**
     * On init
     */
    ngOnInit(): void {
        // Setup available panels
        const user = this.user();
        this.panels = [
            {
                id: 'user-info',
                icon: 'heroicons_outline:user-circle',
                title: 'User Information',
                description: 'View your user information',
            },
            {
                id: 'permissions',
                icon: 'heroicons_outline:lock-closed',
                title: 'Permissions',
                description: 'View your account permissions',
                data: {
                    total: user.permissions?.length,
                },
            },
        ];

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

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

    /**
     * Navigate to the panel
     *
     * @param panel
     */
    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

    /**
     * Get the details of the panel
     *
     * @param id
     */
    getPanelInfo(id: string): any {
        return this.panels.find((panel) => panel.id === id);
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

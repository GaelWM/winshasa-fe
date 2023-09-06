import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass, NgIf } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    Input,
    OnInit,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';
import { User, UserStatus } from 'app/shared/models';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user',
    standalone: true,
    imports: [
        MatButtonModule,
        MatMenuModule,
        NgIf,
        MatIconModule,
        NgClass,
        MatDividerModule,
        RouterModule,
    ],
})
export class UserComponent implements OnInit {
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;

    user: User;
    destroyRef = inject(DestroyRef);
    userStatus = UserStatus;

    private _changeDetectorRef = inject(ChangeDetectorRef);
    private _router = inject(Router);
    private _userService = inject(UserService);
    private _authService = inject(AuthService);

    constructor() {}

    /**
     * On init
     */
    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((user: User) => {
                this.user = user;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Update the user status
     *
     * @param status
     */
    updateUserStatus(status: UserStatus): void {
        if (!this.user) {
            return;
        }

        this._userService.update({ ...this.user, status }).subscribe();
    }

    /**
     * Sign out
     */
    signOut(): void {
        this._authService
            .signOut()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this._router.navigate(['/sign-out']);
            });
    }
}

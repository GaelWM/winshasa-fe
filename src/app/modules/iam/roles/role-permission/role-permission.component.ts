import { AsyncPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    ViewChild,
    ViewEncapsulation,
    computed,
    effect,
    inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule,
    MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Observable, map, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { RolesService } from 'app/services/roles.service';
import { ApiResult, Role } from 'app/shared/models';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Permission } from 'app/shared/models/permission.model';
import { PermissionsService } from 'app/services/permissions.service';
import { AuthService } from 'app/services/auth.service';

@Component({
    selector: 'app-role-permission',
    templateUrl: './role-permission.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatSidenavModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        NgFor,
        NgIf,
        MatSelectModule,
        MatOptionModule,
        TitleCasePipe,
        MatChipsModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        AsyncPipe,
    ],
})
export class RolePermissionComponent {
    #rolesService = inject(RolesService);
    #permissionsService = inject(PermissionsService);
    #authService = inject(AuthService);
    #fb = inject(FormBuilder);
    #destroyRef = inject(DestroyRef);

    $permissions = this.#permissionsService.$permissions;

    separatorKeysCodes: number[] = [ENTER, COMMA];

    chipForm = this.#fb.group({
        permCtrl: [''],
    });
    filteredPermissions: Observable<string[]>;
    selectedPermissions: { [roleId: string]: string[] } = {};
    $allPermissions = computed(() =>
        (this.$permissions().data as Permission[])?.map((perm) => perm.name)
    );

    #roles$: Observable<ApiResult<Role[]>> = this.#rolesService
        .all<Role[]>({ perPage: 100 })
        .pipe(
            map((result: ApiResult<Role[]>) => {
                if (result.data) {
                    this.#rolesService.$roles.set(result);
                }
                return result;
            }),
            takeUntilDestroyed()
        );
    $roles = toSignal(this.#roles$, { initialValue: [] as ApiResult<Role[]> });

    @ViewChild('roleInput') roleInput: ElementRef<HTMLInputElement>;

    announcer = inject(LiveAnnouncer);

    constructor() {
        effect(() => {
            this.filteredPermissions = this.chipForm
                .get('permCtrl')
                ?.valueChanges.pipe(
                    startWith(null),
                    map((permission: string | null) =>
                        permission
                            ? this._filter(permission)
                            : this.$allPermissions().slice()
                    )
                );
        });

        effect(() => {
            (this.$roles().data as Role[])?.forEach((role) => {
                this.selectedPermissions[role.id] =
                    role.permissions.flat().map((perm) => perm.name) ?? [];
            });
        });
    }

    add(roleId: string, event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        // Add our role
        if (value) {
            this.selectedPermissions[roleId].push(value);
        }

        // Clear the input value
        event.chipInput!.clear();

        this.chipForm.get('permCtrl')?.setValue(null);
    }

    remove(roleId: string, role: string): void {
        const index = this.selectedPermissions[roleId].indexOf(role);

        if (index >= 0) {
            this.selectedPermissions[roleId].splice(index, 1);

            this.announcer.announce(`Removed ${role}`);
        }

        this.#rolesService
            .revokePermissions(
                roleId,
                this.selectedPermissions[roleId].join(',')
            )
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe();
        this.#authService
            .check()
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe();
    }

    selected(roleId: string, event: MatAutocompleteSelectedEvent): void {
        this.selectedPermissions[roleId].push(event.option.value);
        this.chipForm.get('permCtrl')?.setValue(null);

        this.#rolesService
            .assignPermissions(
                roleId,
                this.selectedPermissions[roleId].join(',')
            )
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe();

        this.#authService
            .check()
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe();
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.$allPermissions().filter((perm) =>
            perm.toLowerCase().includes(filterValue)
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

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

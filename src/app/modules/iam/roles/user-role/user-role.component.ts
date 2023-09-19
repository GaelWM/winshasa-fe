import { AsyncPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    ViewChild,
    ViewEncapsulation,
    computed,
    effect,
    inject,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
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
import { Observable, map, startWith, tap } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { UserService } from 'app/services/user.service';
import { RolesService } from 'app/services/roles.service';
import { ApiResult, Role, User } from 'app/shared/models';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-user-role',
    templateUrl: './user-role.component.html',
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
export class UserRoleComponent {
    #userService = inject(UserService);
    #rolesService = inject(RolesService);
    #fb = inject(FormBuilder);

    $roles = this.#rolesService.$roles;

    separatorKeysCodes: number[] = [ENTER, COMMA];

    chipForm = this.#fb.group({
        roleCtrl: [''],
    });
    filteredRoles: Observable<string[]>;
    selectedRoles: { [userId: string]: string[] } = {};
    $allRoles = computed(() =>
        (this.$roles().data as Role[])?.map((role) => role.name)
    );

    #users$: Observable<ApiResult<User[]>> = this.#userService
        .all<User[]>({ perPage: 100 })
        .pipe(
            map((result: ApiResult<User[]>) => {
                if (result.data) {
                    this.#userService.users.set(result);
                }
                return result;
            }),
            takeUntilDestroyed()
        );
    $users = toSignal(this.#users$, { initialValue: [] as ApiResult<User[]> });

    @ViewChild('roleInput') roleInput: ElementRef<HTMLInputElement>;

    announcer = inject(LiveAnnouncer);

    constructor() {
        effect(() => {
            this.filteredRoles = this.chipForm
                .get('roleCtrl')
                ?.valueChanges.pipe(
                    startWith(null),
                    map((role: string | null) =>
                        role ? this._filter(role) : this.$allRoles().slice()
                    )
                );
        });

        effect(() => {
            (this.$users().data as User[])?.forEach((user) => {
                this.selectedRoles[user.id] = user.roles ?? [];
            });
        });
    }

    add(userId: string, event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        // Add our role
        if (value) {
            this.selectedRoles[userId].push(value);
        }

        // Clear the input value
        event.chipInput!.clear();

        this.chipForm.get('roleCtrl')?.setValue(null);
    }

    remove(userId: string, role: string): void {
        const index = this.selectedRoles[userId].indexOf(role);

        if (index >= 0) {
            this.selectedRoles[userId].splice(index, 1);

            this.announcer.announce(`Removed ${role}`);
        }
    }

    selected(userId: string, event: MatAutocompleteSelectedEvent): void {
        this.selectedRoles[userId].push(event.option.viewValue);
        this.chipForm.get('roleCtrl')?.setValue(null);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.$allRoles().filter((role) =>
            role.toLowerCase().includes(filterValue)
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

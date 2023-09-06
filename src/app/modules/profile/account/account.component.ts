import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import {
    Component,
    DestroyRef,
    WritableSignal,
    computed,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    NgForm,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SettingsComponent } from 'app/layout/common/settings/settings.component';
import { UserService } from 'app/services/user.service';
import { FileUploadComponent } from 'app/shared/components/file-upload/file-upload.component';
import { FormError, User } from 'app/shared/models';

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatIconModule,
        SettingsComponent,
        FileUploadComponent,
        MatIconModule,
    ],
    standalone: true,
})
export class SettingsAccountComponent {
    private destroyRef = inject(DestroyRef);
    private _userService = inject(UserService);
    private _formBuilder = inject(FormBuilder);

    formFieldHelpers: string = '';
    submitted: boolean = false;
    errors: WritableSignal<FormError[]> = signal([]);

    user = toSignal(this._userService.user$, { initialValue: {} as User });

    accountForm = computed(() => {
        const user = this.user();
        return this._formBuilder.group({
            id: [user?.id ?? ''],
            firstName: [user?.firstName ?? '', [Validators.required]],
            lastName: [user?.lastName ?? '', [Validators.required]],
            email: [user?.email ?? '', [Validators.required, Validators.email]],
        });
    });

    onSubmitForm(form: NgForm): void {
        const user = { ...this._userService.user, ...form.value };
        this._userService
            .update(user)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: HttpResponse<any>) => {
                    console.log('response: ', response);
                },
                error: (err) => {
                    if (err?.error) {
                        this.errors.set([{ message: err?.error?.message }]);
                    }
                    if (err?.error?.errors) {
                        this.errors.set(err?.error?.errors);
                    }
                },
            });
    }
}

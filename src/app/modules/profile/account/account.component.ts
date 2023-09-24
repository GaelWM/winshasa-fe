import { CommonModule } from '@angular/common';
import { Component, WritableSignal, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseAlertComponent } from '@fuse/components/alert';
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
        FuseAlertComponent,
    ],
    standalone: true,
})
export class SettingsAccountComponent {
    #userService = inject(UserService);
    formFieldHelpers: string = '';
    submitted: boolean = false;
    errors: WritableSignal<FormError[]> = signal([]);

    user = toSignal(this.#userService.user$, { initialValue: {} as User });

    onImageUploaded(event: any): void {
        if (event.error) {
            this.errors.set([{ message: event.error }]);
            if (event?.error?.error?.errors) {
                this.errors.set(event?.error?.error?.errors);
            }
        } else {
            this.errors.set([]);
            this.#userService.user = {
                ...this.#userService.user,
                ...event.res,
            };
        }
    }
}

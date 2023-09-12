import { CommonModule } from '@angular/common';
import {
    Component,
    WritableSignal,
    computed,
    inject,
    signal,
} from '@angular/core';
import {
    FormBuilder,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FuseAlertComponent } from '@fuse/components/alert';
import { UserService } from 'app/services/user.service';
import { ErrorFormTemplateComponent } from 'app/shared/components/error-form-template/error-form-template.component';
import { FormError, User } from 'app/shared/models';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        FormsModule,
        MatSelectModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        FuseAlertComponent,
        ErrorFormTemplateComponent,
    ],
    standalone: true,
})
export class UserFormComponent {
    public data = inject(MAT_DIALOG_DATA) as {
        title: string;
        user: User;
        action: string;
    };
    public dialogRef = inject(MatDialogRef<UserFormComponent>);
    private _userService = inject(UserService);
    private _formBuilder = inject(FormBuilder);

    formFieldHelpers: string = '';
    submitted: boolean = false;
    errors: WritableSignal<FormError[]> = signal([]);

    userForm = computed(() => {
        const user = this.data.user;
        return this._formBuilder.group({
            id: [user?.id ?? ''],
            firstName: [
                user?.firstName ?? '',
                [Validators.required, Validators.minLength(2)],
            ],
            lastName: [user?.lastName ?? '', [Validators.minLength(2)]],
            email: [user?.email ?? '', [Validators.required, Validators.email]],
            phone: [user?.phone ?? ''],
            address: [user?.address ?? ''],
            isActive: [user?.isActive ?? true],
        });
    });

    onSubmitNewUser(userForm: NgForm): void {
        this.submitted = true;
        if (this.data.action === 'edit' && this.data.user.id) {
            this.editUser(userForm);
        } else {
            this.addUser(userForm);
        }
    }

    private addUser(userForm: NgForm): void {
        this._userService.storeUser(userForm.value).subscribe({
            next: () => {
                this.dialogRef.close();
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

    private editUser(userForm: NgForm): void {
        this._userService
            .updateUser(this.data.user.id, userForm.value)
            .subscribe({
                next: () => {
                    this.dialogRef.close();
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

    onCloseModal(event: Event): void {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.dialogRef.close('modal closed');
    }
}

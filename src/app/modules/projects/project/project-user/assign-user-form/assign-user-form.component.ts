import {
    AfterViewInit,
    Component,
    DestroyRef,
    Input,
    ViewChild,
    WritableSignal,
    computed,
    inject,
    signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ModalTemplateComponent,
    WinFormBuilder,
} from 'app/shared/components/modal-template/modal-template.component';
import {
    FormBuilder,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
} from '@angular/forms';
import { ProjectsService } from 'app/services/projects.service';
import { UserService } from 'app/services/user.service';
import {
    FormError,
    PaymentFrequency,
    PaymentMethod,
    Project,
    ProjectUser,
    Role,
    User,
} from 'app/shared/models';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { RolesService } from 'app/services/roles.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FuseAlertComponent } from '@fuse/components/alert';
import { ErrorFormTemplateComponent } from 'app/shared/components/error-form-template/error-form-template.component';
import { MatButtonModule } from '@angular/material/button';
import {
    TOAST_STATE,
    ToastService,
} from 'app/shared/components/toast/toast.service';
import { ModalTemplateService } from 'app/shared/components/modal-template/modal-template.service';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-assign-user-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        ErrorFormTemplateComponent,
        FuseAlertComponent,
        MatButtonModule,
        MatInputModule,
    ],
    templateUrl: './assign-user-form.component.html',
})
export class AssignUserFormComponent
    extends WinFormBuilder
    implements AfterViewInit
{
    #userService = inject(UserService);
    #roleService = inject(RolesService);
    #modalService = inject(ModalTemplateService);
    #toastService = inject(ToastService);
    #projectService = inject(ProjectsService);
    #fb = inject(FormBuilder);
    #destroyRef = inject(DestroyRef);

    @Input() showSaveButton = false;
    @Input() asModal = false;
    @Input() user: User = {} as User;

    @ViewChild('projectNgForm') _form: NgForm;
    form: NgForm = {} as NgForm;

    errors: WritableSignal<FormError[]> = signal([]);

    paymentFrequencyOpts = Object.values(PaymentFrequency);
    paymentMethodOpts = Object.values(PaymentMethod);

    #users$ = this.#userService.all<User[]>().pipe(
        takeUntilDestroyed(),
        map((d) => d.data as User[]),
        catchError(() => of([] as User[]))
    );
    $users = toSignal(this.#users$, { initialValue: [] as User[] });
    $userOpts = computed(() => {
        const users = this.$users() as User[];
        return users.map((u) => ({ id: u.id, name: u.fullName }));
    });

    #roles$ = this.#roleService.all<Role[]>().pipe(
        takeUntilDestroyed(),
        map((d) => d.data as Role[]),
        catchError(() => of([] as Role[]))
    );
    $roles = toSignal(this.#roles$, { initialValue: [] as Role[] });
    $roleOpts = computed(() => {
        const roles = this.$roles() as Role[];
        return roles.map((r) => ({ id: r.id, name: r.name }));
    });

    $selectedProjectUser = this.#projectService.$selectedProjectUser;
    $selectedProject = this.#projectService.selectedProject;

    $assignUserForm = computed(() => {
        const projectUser = this.$selectedProjectUser();
        const project = this.$selectedProject().data as Project;
        return this.#fb.group({
            projectId: [project?.id],
            userId: [{ value: this.user?.id ?? '', disabled: true }],
            roleId: [projectUser?.role?.id ?? ''],
            salary: [projectUser?.salary ?? undefined],
            paymentMethod: [projectUser?.payment?.method ?? ''],
            paymentFrequency: [projectUser?.payment?.frequency ?? ''],
        });
    });

    onAssignUserToProject(form: NgForm): void {
        if (!form.valid) {
            return;
        }

        this.form.form.get('userId')?.enable();
        const payload = form.value;
        this.#projectService
            .assignUserToProject(payload)
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe({
                next: () => {
                    this.#toastService.showToast(
                        TOAST_STATE.SUCCESS,
                        'User assigned to project'
                    );

                    this.updateUsers(payload);
                    this.#modalService.closeModal();
                    this.form.form.get('userId')?.disable();
                },
                error: (error) => {
                    this.errors.set(error.error.errors);
                    this.form.form.get('userId')?.disable();
                },
            });
    }

    ngAfterViewInit(): void {
        this.form = this._form;
    }

    private updateUsers(payload: any): void {
        const allUsers = this.#projectService.$allUsers();
        const remainingUsers = allUsers.filter(
            (user) => user.id !== this.user.id
        );
        this.#projectService.$allUsers.set(remainingUsers);

        const assignedUsers = this.#projectService.$assignedUsers();
        const projectUserToAdd = new ProjectUser({
            userId: this.user.id,
            projectId: payload.projectId,
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            email: this.user.email,
            phone: this.user.phone,
            roleName: this.$roleOpts().find((r) => r.id === payload.roleId)
                ?.name,
            projectName: this.$selectedProject().data?.name,
            roleId: payload.roleId,
            salary: payload.salary,
            paymentMethod: payload.paymentMethod,
            paymentFrequency: payload.paymentFrequency,
        });
        this.#projectService.$assignedUsers.set([
            projectUserToAdd,
            ...assignedUsers,
        ]);
    }
}

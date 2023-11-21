import {
    Component,
    DestroyRef,
    WritableSignal,
    effect,
    inject,
    signal,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { UserService } from 'app/services/user.service';
import { ProjectUser, User } from 'app/shared/models';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { UserItemComponent } from './user-item/user-item.component';
import { ProjectsService } from 'app/services/projects.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalTemplateComponent } from 'app/shared/components/modal-template/modal-template.component';
import { AssignUserFormComponent } from './assign-user-form/assign-user-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OnNullPipe } from 'app/shared/pipes/on-null-pipe/on-null.pipe';
import { ToastService } from 'app/shared/components/toast/toast.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'app-project-user',
    standalone: true,
    imports: [
        CommonModule,
        UserItemComponent,
        MatIconModule,
        MatButtonModule,
        CurrencyPipe,
        OnNullPipe,
    ],
    templateUrl: './project-user.component.html',
})
export class ProjectUserComponent {
    // services injection initialization
    #userService = inject(UserService);
    #projectService = inject(ProjectsService);
    #dialog = inject(MatDialog);
    #destroyRef = inject(DestroyRef);
    #toastService = inject(ToastService);
    #fuseConfirmationService = inject(FuseConfirmationService);

    users$ = this.#userService.all<User[]>().pipe(
        takeUntilDestroyed(),
        map((apiResponse) => apiResponse.data as User[]),
        map((users) =>
            users.sort((a, b) => a.fullName.localeCompare(b.fullName))
        )
    );
    #$users = toSignal(this.users$, { initialValue: [] as User[] });
    #$assignedUsers = toSignal(this.#projectService.getProjectUsers(), {
        initialValue: [] as ProjectUser[],
    });
    #$remainingUsers: WritableSignal<User[]> = signal([] as User[]);

    $assignedUsers = this.#projectService.$assignedUsers;
    $remainingUsers = this.#projectService.$allUsers;

    constructor() {
        effect(
            () => {
                const users = this.#$users();
                const assignedUsers = this.#$assignedUsers();
                const remainingUsers = users.filter(
                    (user) =>
                        !assignedUsers.find(
                            (assignedUser) => assignedUser.user.id === user.id
                        )
                );
                this.#projectService.$assignedUsers.set(assignedUsers);
                this.#projectService.$allUsers.set(remainingUsers);
                this.#$remainingUsers.set(remainingUsers);
            },
            { allowSignalWrites: true }
        );
    }

    /**
     * Assign user to project
     *
     * @param user
     */
    onAssignUser(event: Event, user: User): void {
        event.stopPropagation();
        event.preventDefault();
        this.#projectService.$selectedProjectUser.set(null);
        this.#dialog.open(ModalTemplateComponent, {
            data: {
                form: AssignUserFormComponent,
                title: `Assign user to project`,
                inputs: { asModal: true, user: user },
            },
        });
    }

    /**
     * Remove user from project
     *
     * @param user
     */

    onRemoveUser(event: Event, projectUser: ProjectUser): void {
        event.stopPropagation();
        event.preventDefault();

        const confirmation = this.#fuseConfirmationService.open({
            title: 'Remove User',
            message:
                'Are you sure you want to remove this user from this project? This action cannot be undone.',
            actions: {
                confirm: {
                    label: 'Remove User',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.#projectService
                    .removeUserFromProject({ userId: projectUser.user.id })
                    .pipe(takeUntilDestroyed(this.#destroyRef))
                    .subscribe({
                        next: () => {
                            this.updateAssignedUsers(projectUser);
                        },
                        error: (error) => {
                            this.#toastService.error(error.error.message);
                        },
                    });
            }
        });
    }

    onGeneratePayment(event: Event, projectUser: ProjectUser): void {
        event.stopPropagation();
        event.preventDefault();

        const confirmation = this.#fuseConfirmationService.open({
            title: 'Generate Payment(s)',
            message:
                'Are you sure you want to generate payment(s) for this user? This action cannot be undone.',
            icon: {
                show: true,
                name: 'heroicons_outline:banknotes',
                color: 'primary',
            },
            actions: {
                confirm: {
                    label: 'Generate Payment(s)',
                    color: 'primary',
                },
            },
        });
    }

    /**
     * Track by function for loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    private updateAssignedUsers(projectUser: ProjectUser): void {
        this.#projectService.$assignedUsers.set(
            this.#$assignedUsers().filter(
                (assignedUser) => assignedUser.user.id !== projectUser.user.id
            )
        );
        this.#projectService.$allUsers.update((users) => [
            ...users,
            new User({
                id: projectUser.user.id,
                firstName: projectUser.user.fullName.split(' ')[0],
                lastName: projectUser.user.fullName.split(' ')[1],
                fullName: projectUser.user.fullName,
                email: projectUser.user.email,
                phone: projectUser.user.phone,
            }),
        ]);
    }
}

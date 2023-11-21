import { HttpClient } from '@angular/common/http';
import {
    addDays,
    addWeeks,
    addMonths,
    addYears,
    format,
    addQuarters,
    parseISO,
} from 'date-fns';
import {
    DestroyRef,
    Injectable,
    WritableSignal,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseService, baseUrl } from 'app/services/base.service';
import {
    ApiResult,
    Currency,
    IPayment,
    IProjectUser,
    PAYMENT_FREQUENCY_TO_DAYS,
    Payment,
    PaymentFrequency,
    PaymentOwnerType,
    PaymentStatus,
    Project,
    ProjectUser,
    User,
} from 'app/shared/models';
import {
    BehaviorSubject,
    Observable,
    concatMap,
    filter,
    finalize,
    forkJoin,
    map,
    range,
    switchMap,
    tap,
} from 'rxjs';
import { PaymentsService } from './payments.service';

@Injectable({
    providedIn: 'root',
})
export class ProjectsService extends BaseService {
    #destroyRef = inject(DestroyRef);
    #http = inject(HttpClient);
    #paymentService = inject(PaymentsService);

    constructor() {
        super('projects');
    }

    public _submitted: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public onSubmitLeaseAgreementForm$: Observable<any> =
        this._submitted.asObservable();

    projects: WritableSignal<ApiResult<Project[]>> = signal(
        {} as ApiResult<Project[]>
    );

    selectedProject: WritableSignal<ApiResult<Project>> = signal(
        {} as ApiResult<Project>
    );

    $allUsers: WritableSignal<User[]> = signal([] as User[]);
    $assignedUsers: WritableSignal<ProjectUser[]> = signal([] as ProjectUser[]);
    $selectedProjectUser: WritableSignal<ProjectUser> = signal(
        {} as ProjectUser
    );

    submitProjectForm(flag: boolean): void {
        this._submitted.next(flag);
    }

    getProjectUsers(): Observable<ProjectUser[]> {
        this.updateResource(
            `projects/${this.selectedProject().data?.id}/assigned-users`
        );
        return this.all<IProjectUser[]>().pipe(
            filter((result) => result['data'].length > 0),
            map((result) =>
                result['data'].map((user) => new ProjectUser(user))
            ),
            finalize(() => this.updateResource('projects')),
            takeUntilDestroyed(this.#destroyRef)
        );
    }

    assignUserToProject(payload: any): Observable<unknown> {
        this.updateResource(
            `projects/${this.selectedProject().data?.id}/assign-users`
        );
        return this.post(payload).pipe(
            takeUntilDestroyed(this.#destroyRef),
            finalize(() => this.updateResource('projects'))
        );
    }

    removeUserFromProject(payload: any): Observable<unknown> {
        this.updateResource(
            `projects/${this.selectedProject().data?.id}/remove-users`
        );
        return this.post(payload).pipe(
            takeUntilDestroyed(this.#destroyRef),
            finalize(() => this.updateResource('projects'))
        );
    }

    generateUserPayments(
        projectUser: ProjectUser,
        project: Project
    ): Observable<ApiResult<Payment | Payment[]>> {
        const payments: IPayment[] = this.definePayments(projectUser, project);
        console.log('payments: ', payments);

        if (payments.length === 0) {
            throw new Error('No payments to generate');
        }

        return this.#paymentService
            .storePayment({ payments })
            .pipe(takeUntilDestroyed(this.#destroyRef));
    }

    storeProject(payload: Project): Observable<ApiResult<Project>> {
        return this.post<Project>(payload).pipe(
            tap((result) => {
                this.projects.update((projects: ApiResult<Project[]>) => {
                    projects.data = [
                        result.data as Project,
                        ...(projects.data as Project[]),
                    ];
                    projects.meta.total++;
                    return projects;
                });
            }),
            takeUntilDestroyed(this.#destroyRef)
        );
    }

    updateProject(
        id: string,
        payload: Project
    ): Observable<ApiResult<Project>> {
        return this.patch<Project>(id, payload).pipe(
            tap((result) => {
                this.selectedProject.set(result);
                this.projects.update((projects: ApiResult<Project[]>) => {
                    projects.data = [
                        result.data as Project,
                        ...(projects.data as Project[]).filter(
                            (t: Project) => t.id !== id
                        ),
                    ];
                    return projects;
                });
            }),
            takeUntilDestroyed(this.#destroyRef)
        );
    }

    deleteProject(id: string): Observable<ApiResult<Project>> {
        return this.delete<Project>(id).pipe(
            tap(() => {
                this.projects.update((projects: ApiResult<Project[]>) => {
                    projects.data = (projects.data as Project[]).filter(
                        (t: Project) => t.id !== id
                    );
                    projects.meta.total--;
                    return projects;
                });
            }),
            takeUntilDestroyed(this.#destroyRef)
        );
    }

    private definePayments(
        projectUser: ProjectUser,
        project: Project
    ): IPayment[] {
        const payments: IPayment[] = [];

        const addFunction = {
            [PaymentFrequency.DAILY]: addDays,
            [PaymentFrequency.WEEKLY]: addWeeks,
            [PaymentFrequency.BI_WEEKLY]: addWeeks(
                parseISO(project.startDate),
                2
            ),
            [PaymentFrequency.MONTHLY]: addMonths,
            [PaymentFrequency.QUARTERLY]: addQuarters,
            [PaymentFrequency.ANNUALLY]: addYears,
            [PaymentFrequency.BI_ANNUALLY]: addYears(
                parseISO(project.startDate),
                2
            ),
        }[projectUser.payment?.frequency];

        if (!addFunction) {
            throw new Error(
                `Invalid payment frequency: ${projectUser.payment?.frequency}`
            );
        }

        const projectDurationInDays = Math.floor(
            (new Date(project.endDate).getTime() -
                new Date(project.startDate).getTime()) /
                (1000 * 3600 * 24)
        );
        console.log('projectDurationInDays: ', projectDurationInDays);
        // calculate total payments based on project duration and payment frequency
        const totalPayments = Math.floor(
            projectDurationInDays /
                PAYMENT_FREQUENCY_TO_DAYS.get(projectUser.payment?.frequency)
        );
        console.log('addFunction: ', addFunction);
        console.log('totalPayments: ', totalPayments);

        for (let i = 0; i < totalPayments; i++) {
            const dueDate = addFunction(parseISO(project.startDate), i);
            const payment: IPayment = {
                ownerId: projectUser.user.id,
                ownerType: PaymentOwnerType.PROJECT_USER,
                paymentMethod: projectUser.payment?.method,
                amount: projectUser.salary,
                currency: Currency.USD,
                dueDate: format(dueDate, 'yyyy-MM-dd'),
                status: PaymentStatus.PENDING,
                generatedBy: projectUser.project.name,
            };

            payments.push(payment);
        }

        return payments;
    }
}

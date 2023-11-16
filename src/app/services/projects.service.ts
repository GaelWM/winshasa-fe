import { HttpClient } from '@angular/common/http';
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
    IProjectUser,
    Project,
    ProjectUser,
    User,
} from 'app/shared/models';
import {
    BehaviorSubject,
    Observable,
    filter,
    finalize,
    map,
    switchMap,
    tap,
} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProjectsService extends BaseService {
    #destroyRef = inject(DestroyRef);
    #http = inject(HttpClient);

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
}

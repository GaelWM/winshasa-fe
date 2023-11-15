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
import { BehaviorSubject, Observable, filter, map, switchMap, tap } from 'rxjs';

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
        const url = `${baseUrl}projects/${
            this.selectedProject().data?.id
        }/assigned-users`;
        return this.#http.get<IProjectUser[]>(url).pipe(
            filter((result) => result['data'].length > 0),
            map((result) =>
                result['data'].map((user) => new ProjectUser(user))
            ),
            takeUntilDestroyed(this.#destroyRef)
        );
    }

    assignUserToProject(payload: any): Observable<unknown> {
        const url = `${baseUrl}projects/${
            this.selectedProject().data?.id
        }/assign-users`;
        return this.#http
            .post(url, payload)
            .pipe(takeUntilDestroyed(this.#destroyRef));
    }

    removeUserFromProject(payload: any): Observable<unknown> {
        const url = `${baseUrl}projects/${
            this.selectedProject().data?.id
        }/remove-users`;
        return this.#http
            .post(url, payload)
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
}

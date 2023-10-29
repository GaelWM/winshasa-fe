import { Injectable, WritableSignal, signal } from '@angular/core';
import { BaseService } from 'app/services/base.service';
import { ApiResult, Project } from 'app/shared/models';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ProjectsService extends BaseService {
    constructor() {
        super('projects');
    }
    public _submitted: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public onSubmitProjectForm$: Observable<any> =
        this._submitted.asObservable();

    projects: WritableSignal<ApiResult<Project[]>> = signal(
        {} as ApiResult<Project[]>
    );

    selectedProject: WritableSignal<ApiResult<Project>> = signal(
        {} as ApiResult<Project>
    );

    onProjectFormSubmit(): Observable<boolean> {
        return this.onSubmitProjectForm$;
    }

    submitProjectForm(flag: boolean): void {
        this._submitted.next(flag);
    }

    storeProject(payload: Project): Observable<ApiResult<Project>> {
        return this.post<Project>(payload).pipe(
            tap((result) => {
                this.projects.mutate((projects: ApiResult<Project[]>) => {
                    projects.data = [
                        result.data as Project,
                        ...(projects.data as Project[]),
                    ];
                    projects.meta.total++;
                    return projects;
                });
            })
        );
    }

    updateProject(
        id: string,
        payload: Project
    ): Observable<ApiResult<Project>> {
        return this.patch<Project>(id, payload).pipe(
            tap((result) => {
                this.selectedProject.set(result);
                this.projects.mutate((projects: ApiResult<Project[]>) => {
                    projects.data = [
                        result.data as Project,
                        ...(projects.data as Project[]).filter(
                            (t: Project) => t.id !== id
                        ),
                    ];
                    return projects;
                });
            })
        );
    }

    deleteProject(id: string): Observable<ApiResult<Project>> {
        return this.delete<Project>(id).pipe(
            tap(() => {
                this.projects.mutate((projects: ApiResult<Project[]>) => {
                    projects.data = (projects.data as Project[]).filter(
                        (t: Project) => t.id !== id
                    );
                    projects.meta.total--;
                    return projects;
                });
            })
        );
    }
}

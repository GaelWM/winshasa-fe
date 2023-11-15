import { CommonModule } from '@angular/common';
import {
    Component,
    ViewEncapsulation,
    effect,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ThemePalette } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiResult, Project } from 'app/shared/models';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { ProjectsService } from 'app/services/projects.service';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatIconModule,
        MatMenuModule,
        MatTooltipModule,
        MatTabsModule,
        MatButtonModule,
        RouterModule,
    ],

    standalone: true,
})
export class ProjectComponent {
    #projectService = inject(ProjectsService);
    #route = inject(ActivatedRoute);

    background: ThemePalette = 'accent';

    private project$: Observable<ApiResult<Project>> = this.#route.params.pipe(
        switchMap((params) => this.#projectService.get<Project>(params['id'])),
        tap((project: ApiResult<Project>) => {
            if (project) {
                this.#projectService.selectedProject.set(project);
            }
        }),
        catchError(() => of(undefined)),
        takeUntilDestroyed()
    );
    projectTemp = toSignal(this.project$, {
        initialValue: {} as ApiResult<Project>,
    });

    $project = signal({} as ApiResult<Project>);

    constructor() {
        effect(() => {
            this.projectTemp();
            this.$project = this.#projectService.selectedProject;
        });
    }
}

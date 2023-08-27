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
import { SitesService } from 'app/services/sites.service';
import { ApiResult, Site } from 'app/shared/models';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-site',
    templateUrl: './site.component.html',
    styleUrls: ['./site.component.scss'],
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
export class SiteComponent {
    private _siteService = inject(SitesService);
    private _route = inject(ActivatedRoute);

    background: ThemePalette = 'accent';

    private site$: Observable<ApiResult<Site>> = this._route.params.pipe(
        switchMap((params) => this._siteService.get<Site>(params['id'])),
        tap((site: ApiResult<Site>) => {
            if (site) {
                this._siteService.selectedSite.set(site);
            }
        }),
        catchError(() => of(undefined)),
        takeUntilDestroyed()
    );
    siteTemp = toSignal(this.site$, {
        initialValue: {} as ApiResult<Site>,
    });

    site = signal({} as ApiResult<Site>);

    constructor() {
        effect(() => {
            this.siteTemp();
            this.site = this._siteService.selectedSite;
        });
    }

    onSave(event: Event): void {
        event.preventDefault();
        // this._siteService.submit(true);
    }
}

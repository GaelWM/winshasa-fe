import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from 'app/shared/components/toolbar/toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WinTableModule } from 'app/shared/components/win-table/win-table.module';
import { ColumnSetting } from 'app/shared/components/win-table/win-table.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { TemplateService } from '../../services/template.service';
import { Template } from 'app/shared/models';
import { UserService } from 'app/services/user/user.service';
import { User } from 'app/services/user/user.types';

@Component({
    selector: 'app-template',
    standalone: true,
    imports: [
        CommonModule,
        ToolbarComponent,
        MatButtonModule,
        MatIconModule,
        WinTableModule,
    ],
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.scss'],
})
export class TemplateComponent {
    private _userService = inject(UserService);
    private _templatesService = inject(TemplateService);

    user = toSignal(this._userService.user$, { initialValue: {} as User });
    columns: ColumnSetting[] = [
        { title: 'Name', key: 'name' },
        { title: 'Type', key: 'type' },
        { title: 'Description', key: 'details.description' },
    ];
    data = computed(() => {
        const templates = this._templatesService.templates();
        console.log('templates: ', templates);
        const user = this.user();

        return {
            templates: templates.data,
            meta: templates.meta,
            user: user,
            total: templates.meta?.total || 0,
        };
    });
}

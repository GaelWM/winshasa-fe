import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from 'app/shared/toolbar/toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WinTableModule } from 'app/shared/win-table/win-table.module';
import { ColumnSetting } from 'app/shared/win-table/win-table.model';

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
    columns: ColumnSetting[] = [
        { title: 'Name', key: 'name' },
        { title: 'Code', key: 'code' },
        { title: 'Category', key: 'category' },
        { title: 'Quantity', key: 'quantity' },
    ];
    data = [
        { name: 'Phone XL', code: 799, category: 'Phone', quantity: 1 },
        { name: 'Phone Mini', code: 699, category: 'Phone', quantity: 1 },
    ];
}

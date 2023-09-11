import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { FileManagerComponent } from './file-manager.component';
import { FileManagerDetailsComponent } from './details/details.component';
import { fileManagerRoutes } from './file-manager.routing';
import { FileManagerListComponent } from './list/list.component';
import { FolderFormComponent } from './list/folder-form/folder-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    declarations: [
        FileManagerComponent,
        FileManagerDetailsComponent,
        FileManagerListComponent,
        FolderFormComponent,
    ],
    imports: [
        RouterModule.forChild(fileManagerRoutes),
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        SharedModule,
    ],
})
export class FileManagerModule {}

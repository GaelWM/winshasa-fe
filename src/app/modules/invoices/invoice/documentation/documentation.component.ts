import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FileManagerComponent } from 'app/shared/components/file-manager/file-manager.component';

@Component({
    selector: 'app-invoice-documentation',
    standalone: true,
    imports: [CommonModule, RouterModule, FileManagerComponent],
    templateUrl: './documentation.component.html',
})
export class InvoiceDocumentationComponent {}

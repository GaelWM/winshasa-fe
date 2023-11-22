import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseAlertComponent } from '@fuse/components/alert';
import { InvoiceFormComponent } from '../../invoice-form/invoice-form.component';

@Component({
    selector: 'app-invoice-general-details',
    templateUrl: './general-details.component.html',
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatExpansionModule,
        FuseAlertComponent,
        InvoiceFormComponent,
    ],
    standalone: true,
})
export class GeneralDetailsComponent {}

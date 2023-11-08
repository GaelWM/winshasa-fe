import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductFormComponent } from '../../product-form/product-form.component';

@Component({
    selector: 'app-general-details',
    templateUrl: './general-details.component.html',
    imports: [CommonModule, ProductFormComponent],
    standalone: true,
})
export class GeneralDetailsComponent {}

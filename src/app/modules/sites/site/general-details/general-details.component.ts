import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SiteFormComponent } from '../../site-form/site-form.component';

@Component({
    selector: 'app-site-general-details',
    templateUrl: './general-details.component.html',
    imports: [CommonModule, SiteFormComponent],
    standalone: true,
})
export class GeneralDetailsComponent {}

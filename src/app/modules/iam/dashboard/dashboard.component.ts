import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule],
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}

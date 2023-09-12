import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from 'app/shared/components/toolbar/toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-iam',
    standalone: true,
    imports: [
        CommonModule,
        ToolbarComponent,
        MatButtonModule,
        MatIconModule,
        RouterModule,
    ],
    templateUrl: './iam.component.html',
})
export class IamComponent {
    constructor(private router: Router, private route: ActivatedRoute) {}

    onDashboardClick() {
        this.router.navigate(['dashboard'], { relativeTo: this.route });
    }

    onUsersClick() {
        this.router.navigate(['users'], { relativeTo: this.route });
    }

    onRolesClick() {
        this.router.navigate(['roles'], { relativeTo: this.route });
    }
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from 'app/shared/models';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-user-item',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule, MatButtonModule],
    templateUrl: './user-item.component.html',
})
export class UserItemComponent {
    @Input({ required: true }) user: User;
}

import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FileManagerComponent } from 'app/shared/components/file-manager/file-manager.component';

@Component({
    selector: 'documentation',
    templateUrl: './documentation.component.html',
    // encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [RouterModule, FileManagerComponent],
})
export class DocumentationComponent {
    constructor() {}
}

import { registerLocaleData } from '@angular/common';
import localeEnUs from '@angular/common/locales/en';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

registerLocaleData(localeEnUs, 'en');
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet],
})
export class AppComponent {}

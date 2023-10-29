import { registerLocaleData } from '@angular/common';
import localeEnUs from '@angular/common/locales/en';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import localeEn from '@angular/common/locales/en';
import localeEnExtra from '@angular/common/locales/extra/en';
registerLocaleData(localeEn, 'en', localeEnExtra);
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet],
})
export class AppComponent {}

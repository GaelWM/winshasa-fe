import { registerLocaleData } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import localeEn from '@angular/common/locales/en';
import localeEnExtra from '@angular/common/locales/extra/en';
import { ToastComponent } from './shared/components/toast/toast.component';
registerLocaleData(localeEn, 'en', localeEnExtra);
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet, ToastComponent],
})
export class AppComponent {}

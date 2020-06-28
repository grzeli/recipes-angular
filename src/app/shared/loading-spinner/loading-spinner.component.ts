import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-loading-spinner',
    template: '<div class="loader">Loading...</div><div class="overlay"></div>',
    styleUrls: ['./loading-spinner.css']
})
export class LoadingSpinnerComponent {
    @HostBinding('style.width') private width = '100%';
}

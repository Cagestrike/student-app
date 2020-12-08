import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
registerLocaleData(localePl, 'pl');

@Component({
    selector: 'app-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
    @Input() activePageName;
    @Input() currentRouterOutletComponent;

    constructor(
        private router: Router
    ) { }

    ngOnInit() {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.activePageName = this.router.url;
            }
        });
    }

    calendarNext() {
        this.currentRouterOutletComponent.calendarNext();
    }

    calendarPrevious() {
        this.currentRouterOutletComponent.calendarPrevious();
    }

    calendarCreateEvent() {
        this.currentRouterOutletComponent.openCreateEventDialog();
    }
}

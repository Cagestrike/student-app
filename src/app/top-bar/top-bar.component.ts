import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { AuthenticationService } from '../authentication.service';
registerLocaleData(localePl, 'pl');

@Component({
    selector: 'app-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
    @Input() activePageName;
    @Input() currentRouterOutletComponent;
    activePageNameByRoute = new Map().set('dashboard', 'Strona główna')
                                     .set('timetable', 'Plan zajęć')
                                     .set('calendar', 'Kalendarz')
                                     .set('notes', 'Notatki')
                                     .set('groups', 'Grupy')

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    ngOnInit() {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.activePageName = this.router.url;
                this.activePageName = this.activePageNameByRoute.get(this.router.url.split('/')[1]);
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

    noteCreate() {
        this.currentRouterOutletComponent.openCreateNoteDialog();
    }

    logout() {
        this.authenticationService.logout();
    }
}

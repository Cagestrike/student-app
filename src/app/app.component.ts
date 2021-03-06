import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CalendarComponent } from "./calendar/calendar.component";
import { SideNavbarComponent } from './side-navbar/side-navbar.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    isLoggedIn;
    navbarWidth = '72px';
    activePageName = 'Strona główna';
    currentRouterOutletComponent;
    @ViewChild('sideNavbar') sideNavbar: SideNavbarComponent;

    constructor(
        private authService: AuthenticationService,
        private router: Router,
    ) {
        this.isLoggedIn = this.authService.isLoggedIn();
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.isLoggedIn = this.authService.isLoggedIn();
                if(this.isLoggedIn) {
                    this.authService.stopRefreshTokenTimer();
                    this.authService.startRefreshTokenTimer();
                }
            }
        });
    }

    activePageNameChanged(activePageName) {
        this.activePageName = activePageName;
    }

    onRouterOutletActivate(event) {
        this.currentRouterOutletComponent = event;
        console.log(this.currentRouterOutletComponent);
    }

    onNavbarToggle() {
        this.sideNavbar.toggleSideNavbar();
    }
}

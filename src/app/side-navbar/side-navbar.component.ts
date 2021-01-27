import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-side-navbar',
    templateUrl: './side-navbar.component.html',
    styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent implements OnInit {
    @Input() navbarWidth;
    navIcon = 'svg-nav-icon';
    // activePageName;
    @Output() activePageChanged = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    setActivePage(event, activePageName) {
        this.activePageChanged.emit(activePageName);
    }

    toggleSideNavbar() {
        document.querySelector('.menu__aside-wrapper').classList.toggle('open');
    }
}

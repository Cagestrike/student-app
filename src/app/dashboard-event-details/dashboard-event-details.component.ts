import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../event';

@Component({
    selector: 'app-dashboard-event-details',
    templateUrl: './dashboard-event-details.component.html',
    styleUrls: ['./dashboard-event-details.component.css']
})
export class DashboardEventDetailsComponent implements OnInit {
    @Input() event: Event;

    constructor() { }

    ngOnInit(): void {
    }

    getEventHours(event) {
        const eventStartDatetime = new Date(event.startDatetime);
        const eventEndDatetime = new Date(event.endDatetime);
        return `${eventStartDatetime.getHours()}:${eventStartDatetime.getMinutes().toString().padStart(2, '0')} - ${eventEndDatetime.getHours()}:${eventEndDatetime.getMinutes().toString().padStart(2, '0')}`
    }
}

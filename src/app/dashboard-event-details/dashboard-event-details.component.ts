import { Component, Input, OnInit } from '@angular/core';
import { UserEvent } from '../user-event';
import { DashboardEvent } from '../dashboard/dashboard.component';

@Component({
    selector: 'app-dashboard-event-details',
    templateUrl: './dashboard-event-details.component.html',
    styleUrls: ['./dashboard-event-details.component.css']
})
export class DashboardEventDetailsComponent implements OnInit {
    @Input() event: DashboardEvent;

    constructor() { }

    ngOnInit(): void {
    }

    getEventHours(event: DashboardEvent) {
        const eventStartDatetime = new Date(event.start_date);
        const eventEndDatetime = new Date(event.end_date);
        // console.log(eventStartDatetime);
        // console.log(eventEndDatetime);
        return `${eventStartDatetime.getHours()}:${eventStartDatetime.getMinutes().toString().padStart(2, '0')} - ${eventEndDatetime.getHours()}:${eventEndDatetime.getMinutes().toString().padStart(2, '0')}`
    }
}

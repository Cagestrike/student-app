import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Calendar, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { formatDate } from '@fullcalendar/core';
import { NewCalendarEventDialogComponent } from '../new-calendar-event-dialog/new-calendar-event-dialog.component';
import { EventService } from '../event.service';
import { Event } from '../event';
import { start } from 'repl';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {
    events;

    @ViewChild('calendar') calendar: FullCalendarComponent;
    calendarOptions: CalendarOptions = {
        height: '100%',
        initialView: 'dayGridMonth',
        nowIndicator: true,
        locale: 'pl',
        firstDay: 1,
        headerToolbar: {
            start: '',
            center: '',
            end: ''
        },
        eventClick: this.onEventClick,
    };

    constructor(
        public dialog: MatDialog,
        private eventService: EventService
    ) {}

    ngAfterViewInit(): void {
        this.getEvents();
    }

    ngOnInit(): void {

    }

    onEventClick(clickedEvent) {
        console.log(clickedEvent);
    }


    getEvents() {
        this.eventService.getEvents().subscribe(events => {
            this.events = events;
            this.events.map(event => {
                return this.mapToCalendarEvent(event);
            }).forEach(calendarEvent => {
                this.calendar.getApi().addEvent(calendarEvent);
            });
        });
    }

    mapToCalendarEvent(event: Event) {
        let startDatetime = new Date(event.startDatetime);
        let endDatetime = new Date(event.endDatetime);
        if(event.allDayEvent) {
            endDatetime = new Date(endDatetime.getFullYear(), endDatetime.getMonth(), endDatetime.getDate() + 1);
        }
        return {
            title: event.name,
            description: event.description,
            location: event.location,
            start: startDatetime,
            end: endDatetime,
            allDay: event.allDayEvent
        };
    }

    calendarNext() {
        this.calendar.getApi().next();
    }

    calendarPrevious() {
        this.calendar.getApi().prev();
    }

    openCreateEventDialog() {
        const dialogRef = this.dialog.open(NewCalendarEventDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            if(result) {
                this.eventService.addEvent(result)
                    .subscribe(eventResult => {
                        if(eventResult) {
                            this.addEvent(eventResult);
                        }
                    });
            }
        });
    }

    addEvent(event): void {
        this.events.push(event);
        const calendarEvent = this.mapToCalendarEvent(event);
        this.calendar.getApi().addEvent(calendarEvent);
    }

    getDate() {
        return formatDate(this.calendar.getApi().getDate(), {
            month: 'long',
            year: 'numeric',
            locale: 'pl'
        });
    }

}

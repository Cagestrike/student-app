import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Calendar, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { formatDate } from '@fullcalendar/core';
import { NewCalendarEventDialogComponent } from '../new-calendar-event-dialog/new-calendar-event-dialog.component';
import { EventService } from '../event.service';
import { Event } from '../event';

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
        eventClick: (event) => {this.onEventClick(event);},
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
        const eventToEdit: Event = clickedEvent.event.extendedProps.calendarEvent;
        this.openEditEventDialog(eventToEdit);
    }

    openEditEventDialog(eventToEdit: Event) {
        const dialogRef = this.dialog.open(NewCalendarEventDialogComponent, {
            data: {
                eventToEdit
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.eventService.updateEvent(result)
                .subscribe(() => {
                    this.updateEvent(result);
                }, error => {
                    console.log(error);
                });
        })
    }

    updateEvent(event: Event) {
        const eventIndexToUpdate = this.events.findIndex(ev => ev.id === event.id);
        this.events[eventIndexToUpdate] = event;
        this.calendar.getApi().getEventById(event.id).remove();
        this.calendar.getApi().addEvent(this.mapToCalendarEvent(event));
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
            id: event.id,
            title: event.name,
            description: event.description,
            location: event.location,
            start: startDatetime,
            end: endDatetime,
            allDay: event.allDayEvent,
            calendarEvent: event,
            backgroundColor: event.color,
            borderColor: event.color
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
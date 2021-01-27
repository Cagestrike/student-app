import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Calendar, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { formatDate } from '@fullcalendar/core';
import { NewCalendarEventDialogComponent } from '../new-calendar-event-dialog/new-calendar-event-dialog.component';
import { EventService } from '../event.service';
import { UserEvent } from '../user-event';
import { UserEventDate } from '../user-event-date';
import { UserEventWithDates } from '../user-event-with-dates';
import { parseEventsToUserEventsWithDates } from '../api-utils';
import { Router } from '@angular/router';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {
    eventsWithDates: UserEventWithDates[];
    isLoading = true;

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
        eventClick: (event) => { this.onEventClick(event); },
    };

    constructor(
        public dialog: MatDialog,
        private eventService: EventService,
        private router: Router
    ) { }

    ngAfterViewInit(): void {
        this.getEvents();
        this.getDate();
    }

    ngOnInit(): void { }

    onEventClick(clickedEvent): void {
        const eventToEdit: UserEvent = clickedEvent.event.extendedProps.userEvent;
        const eventDateToEdit: UserEventDate = clickedEvent.event.extendedProps.userEventDate;
        const allEventDates: UserEventDate[] = clickedEvent.event.extendedProps.userEventDates;
        const otherEventDates = allEventDates.filter(eventDate => eventDate.id !== eventDateToEdit.id);
        this.openEditEventDialog(eventToEdit, eventDateToEdit, otherEventDates);
    }

    openEditEventDialog(eventToEdit: UserEvent, eventDateToEdit: UserEventDate, otherEventDates: UserEventDate[]): void {
        this.router.navigate(
            [],
            {
                queryParams: { eventDialog: 1 },
                queryParamsHandling: 'merge',
            }
        );
        const dialogRef = this.dialog.open(NewCalendarEventDialogComponent, {
            data: {
                eventToEdit,
                eventDateToEdit,
                otherEventDates
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.clearQueryParams();
            if (result.deleted) {
                this.eventsWithDates.splice(this.eventsWithDates.findIndex(userEvent => userEvent.userEvent.id === eventToEdit.id), 1);
                this.buildCalendarEvents();
                return;
            }

            if (result.userEvent && result.userEventDate) {
                const eventIndexToUpdate = this.eventsWithDates.findIndex(userEventWithDate =>
                    userEventWithDate.userEvent.id === result.userEvent.id
                );
                const eventDateIndexToUpdate = this.eventsWithDates[eventIndexToUpdate].dates.findIndex(eventDate =>
                    eventDate.id === result.userEventDate.id
                );

                this.eventsWithDates[eventIndexToUpdate].userEvent = result.userEvent;
                this.eventsWithDates[eventIndexToUpdate].dates[eventDateIndexToUpdate] = result.userEventDate;
                this.buildCalendarEvents();
            }
        });
    }

    getEvents(): void {
        this.eventService.getEvents().subscribe(events => {
            this.eventsWithDates = parseEventsToUserEventsWithDates(events);
            this.buildCalendarEvents();
            this.isLoading = false;
        }, error => {
            this.isLoading = false;
        });
    }

    buildCalendarEvents(): void {
        const eventArray = this.buildCalendarEventArrayFromUserEventsWithDates(this.eventsWithDates);
        this.calendar.getApi().removeAllEventSources();
        this.calendar.getApi().addEventSource(eventArray);
    }

    buildCalendarEventArrayFromUserEventsWithDates(userEventsWithDates: UserEventWithDates[]): any[] {
        const calendarEvents = [];

        userEventsWithDates.forEach(userEvent => {
            calendarEvents.push(...this.mapUserEventsToCalendarEvents(userEvent.dates, userEvent.userEvent));
        });

        return calendarEvents;
    }

    mapUserEventsToCalendarEvents(userEventDates: UserEventDate[], userEvent: UserEvent): any[] {
        const calendarEvents = [];

        const mappedEvents = userEventDates.map(userEventDate => {
            let endDatetime = new Date(userEventDate.end_date);
            if (userEventDate.allDay_flag === 1) {
                endDatetime = new Date(endDatetime.getFullYear(), endDatetime.getMonth(), endDatetime.getDate() + 1);
            }

            return {
                id: userEventDate.id,
                title: userEvent.name,
                start: userEventDate.start_date,
                end: endDatetime,
                allDay: userEventDate.allDay_flag === 1,
                backgroundColor: userEvent.colour,
                borderColor: userEvent.colour,
                userEventDate,
                userEvent,
                userEventDates,
            };
        });
        calendarEvents.push(...mappedEvents);

        return calendarEvents;
    }

    calendarNext(): void {
        this.calendar.getApi().next();
    }

    calendarPrevious(): void {
        this.calendar.getApi().prev();
    }

    clearQueryParams() {
        this.router.navigate(
            [],
            {
                queryParams: { eventDialog: null, },
                queryParamsHandling: 'merge',
            }
        );
    }

    openCreateEventDialog(): void {
        this.router.navigate(
            [],
            {
                queryParams: { eventDialog: 1 },
                queryParamsHandling: 'merge',
            }
        );
        const dialogRef = this.dialog.open(NewCalendarEventDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            this.clearQueryParams();
            this.eventsWithDates.push({ userEvent: result.userEvent, dates: [result.userEventDate] });
            this.buildCalendarEvents();
        });
    }

    currentCalendarDate;
    getDate(): string {
        this.currentCalendarDate = formatDate(this.calendar.getApi()?.getDate(), {
            month: 'long',
            year: 'numeric',
            locale: 'pl'
        });
        return this.currentCalendarDate;
        // return formatDate(this.calendar.getApi()?.getDate(), {
        //     month: 'long',
        //     year: 'numeric',
        //     locale: 'pl'
        // });
    }

}

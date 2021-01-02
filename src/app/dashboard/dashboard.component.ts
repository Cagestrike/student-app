import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { NoteService } from '../note.service';
import { TimetableService } from '../timetable.service';
import { Event } from '../event';
import { UserService } from '../user.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    upcomingEvents;
    todayEvents;
    tomorrowEvents;
    nextWeekEvents;
    currentTimetable;
    latestNote;
    user;

    constructor(
        private eventService: EventService,
        private noteService: NoteService,
        private timetableService: TimetableService,
        private userService: UserService,
    ) { }

    ngOnInit(): void {
        this.getCurrentUserData();
        this.getDashboardData();
    }

    getCurrentUserData() {
        this.user = this.userService.getCurrentUser();
        console.log(this.user);
    }

    getDashboardData() {
        this.getUpcomingEvents();
        this.getTimetable();
        this.getLatestNote();
        this.getSocialGroups();
    }

    getLatestNote() {
        this.noteService.getNotes()
            .subscribe(notes => {
                this.latestNote = notes[0];
            });
    }

    getTimetable() {
        this.timetableService.getTimetables().subscribe(currentTimetable => {
            if (!currentTimetable.length) {
                return;
            }
            this.currentTimetable = currentTimetable[0];
        });
    }

    getUpcomingEvents() {
        const today = new Date();
        const tomorrow = new Date(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1));
        const dayAfterTomorrow = new Date(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 2));
        const nextWeek = new Date(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 8));

        this.eventService.getEvents().subscribe(events => {
            this.upcomingEvents = events;
            this.upcomingEvents.sort((a, b) => {
                const aStartDatetime = new Date(a.startDatetime);
                const bStartDatetime = new Date(b.startDatetime);
                return aStartDatetime > bStartDatetime ? 1 : ((bStartDatetime > aStartDatetime) ? -1 : 0);
            })

            this.todayEvents = this.upcomingEvents.filter(event => {
                const eventStartDatetime = new Date(event.startDatetime);
                return eventStartDatetime.toDateString() == today.toDateString();
            });
            this.todayEvents = this.todayEvents.slice(0, 2);
            // console.log(this.todayEvents);

            this.tomorrowEvents = this.upcomingEvents.filter(event => {
                const eventStartDatetime = new Date(event.startDatetime);
                return eventStartDatetime.toDateString() == tomorrow.toDateString();
            });
            this.tomorrowEvents = this.tomorrowEvents.slice(0, 2);
            // console.log(this.tomorrowEvents);

            this.nextWeekEvents = this.upcomingEvents.filter(event => {
                const eventStartDatetime = new Date(event.startDatetime);
                // console.log(eventStartDatetime);
                // console.log(nextWeek)
                // console.log(eventStartDatetime > tomorrow);
                // console.log(eventStartDatetime <= nextWeek);
                return eventStartDatetime > dayAfterTomorrow && eventStartDatetime <= nextWeek;
            });
            this.nextWeekEvents = this.nextWeekEvents.slice(0, 4);
            // console.log(this.nextWeekEvents);

        });
    }

    getSocialGroups() {
        throw new Error('Method not implemented.');
    }

    // getEventHours(event) {
    //     const eventStartDatetime = new Date(event.startDatetime);
    //     const eventEndDatetime = new Date(event.endDatetime);
    //     return `${eventStartDatetime.getHours()}:${eventStartDatetime.getMinutes().toString().padStart(2, '0')} - ${eventEndDatetime.getHours()}:${eventEndDatetime.getMinutes().toString().padStart(2, '0')}`
    // }
}

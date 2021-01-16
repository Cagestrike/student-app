import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../event.service';
import { Group } from '../group';
import { GroupService } from '../group.service';
import { Note } from '../note';
import { NoteService } from '../note.service';
import { Timetable } from '../timetable';
import { TimetableService } from '../timetable.service';
import { UserEvent } from '../user-event';
import { UserService } from '../user.service';

export interface DashboardEvent {
    id;
    colour;
    start_date;
    end_date;
    name;
    place;
    allDay_flag;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    upcomingEvents: DashboardEvent[];
    todayEvents;
    tomorrowEvents;
    nextWeekEvents;
    timetables: Timetable[];
    latestNote: Note;
    myGroups: Group[] = [];
    myManagedGroups: Group[] = [];
    user;

    areEventsLoading;
    areTimetablesLoading;
    isNoteLoading;
    areMyGroupsLoading;

    constructor(
        private eventService: EventService,
        private noteService: NoteService,
        private timetableService: TimetableService,
        private userService: UserService,
        private groupService: GroupService,
        private router: Router
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
        this.getTimetables();
        this.getLatestNote();
        this.getSocialGroups();
    }

    getLatestNote() {
        this.isNoteLoading = true;
        this.noteService.getNotes()
            .subscribe(notes => {
                this.isNoteLoading = false;
                this.latestNote = notes[0];
            }, error => {
                console.log(error);
                this.isNoteLoading = false;
            });
    }

    getTimetables() {
        this.areTimetablesLoading = true;
        this.timetableService.getTimetables().subscribe(timetables => {
            console.log(timetables);
            if (!timetables.length) {
                this.areTimetablesLoading = false;
                return;
            }
            this.timetables = timetables.filter(timetable => timetable.activeFlag === '1');
            this.areTimetablesLoading = false;
        }, error => {
            console.log(error);
            this.areTimetablesLoading = false;
        });
    }

    getUpcomingEvents() {
        this.areEventsLoading = true;
        const today = new Date();
        const tomorrow = new Date(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1));
        const dayAfterTomorrow = new Date(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 2));
        const nextWeek = new Date(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 8));

        this.eventService.getEvents().subscribe(events => {
            this.upcomingEvents = events;
            this.upcomingEvents.sort((a, b) => {
                const aStartDatetime = new Date(a.start_date);
                const bStartDatetime = new Date(b.start_date);
                return aStartDatetime > bStartDatetime ? 1 : ((bStartDatetime > aStartDatetime) ? -1 : 0);
            })

            this.todayEvents = this.upcomingEvents.filter(event => {
                const eventStartDatetime = new Date(event.start_date);
                const eventEndDatetime = new Date(event.end_date);
                return eventStartDatetime.toDateString() == today.toDateString() || (eventStartDatetime <= today && eventEndDatetime >= today);
            });
            this.todayEvents = this.todayEvents.slice(0, 2);

            this.tomorrowEvents = this.upcomingEvents.filter(event => {
                const eventStartDatetime = new Date(event.start_date);
                return eventStartDatetime.toDateString() == tomorrow.toDateString();
            });
            this.tomorrowEvents = this.tomorrowEvents.slice(0, 2);

            this.nextWeekEvents = this.upcomingEvents.filter(event => {
                const eventStartDatetime = new Date(event.start_date);
                return eventStartDatetime > dayAfterTomorrow && eventStartDatetime <= nextWeek;
            });
            this.nextWeekEvents = this.nextWeekEvents.slice(0, 4);

            this.areEventsLoading = false;
        }, error => {
            console.log(error);
            this.areEventsLoading = false;
        });
    }

    getSocialGroups() {
        this.areMyGroupsLoading = true;
        this.groupService.getMyGroups(this.userService.getCurrentUser().id)
            .subscribe(result => {
                this.myGroups = result;
                this.myManagedGroups = this.myGroups.filter(group => group.role === 'admin' || group.role === 'god');
                // this.myVerifiedGroups = this.myGroups.filter(group => group.role !== 'unverified');
                // this.myVerifiedGroups.forEach(group => {
                //     this.myVerifiedGroupById.set(group.id, group);
                // });
                // if (this.selectedGroupId && this.myGroups.findIndex(group => group.id === this.selectedGroupId) === -1) {
                //     this.selectedGroupId = null;
                //     this.selectedGroup = null;
                // } else if(this.selectedGroupId && this.myGroups.findIndex(group => group.id === this.selectedGroupId) != -1) {
                //     this.selectedGroup = this.myGroups.find(group => group.id === this.selectedGroupId);
                // }
                this.areMyGroupsLoading = false;
            }, error => {
                this.areMyGroupsLoading = false;
            });
    }

    handleSelectedGroupId(groupId): void {
        this.router.navigate(
            ['/groups'],
            {
                queryParams: { group: groupId },
                queryParamsHandling: 'merge',
                // skipLocationChange: true,
            }
        );
        // const url = this.router.createUrlTree([], {relativeTo: this.activatedRoute, queryParams: {group: this.selectedGroupId}}).toString()
        // this.location.go(`${url}`);
    }

    handleGroupLoading(isLoading): void {
        this.areMyGroupsLoading = isLoading;
    }
    // getEventHours(event) {
    //     const eventStartDatetime = new Date(event.startDatetime);
    //     const eventEndDatetime = new Date(event.endDatetime);
    //     return `${eventStartDatetime.getHours()}:${eventStartDatetime.getMinutes().toString().padStart(2, '0')} - ${eventEndDatetime.getHours()}:${eventEndDatetime.getMinutes().toString().padStart(2, '0')}`
    // }
}

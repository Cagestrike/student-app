import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TimetableService } from '../timetable.service';
import { Timetable } from '../timetable';
import { Router } from '@angular/router';
import { CalendarOptions, EventSourceInput, FullCalendarComponent } from '@fullcalendar/angular';
// import plLocale from '@fullcalendar/core/locales/pl';
import { UniversityClassService } from '../university-class.service';
import { UniversityClass } from '../university-class';
import { MatDialog } from '@angular/material/dialog';
import { NewUniversityClassDialogComponent } from '../new-university-class-dialog/new-university-class-dialog.component';
import { getDayOfWeekByValue } from '../days-of-week';
// import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import { formatDateToAPIFormat, parseActivitiesToUniversityClassesWithDates } from '../api-utils';
import { AuthenticationService } from '../authentication.service';
import { NewTimetableDialogComponent } from '../new-timetable-dialog/new-timetable-dialog.component';
import { UniversityClassWithDates } from '../university-class-with-dates';
import { UniversityClassDate } from '../university-class-date';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector: 'app-timetable',
    templateUrl: './timetable.component.html',
    styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
    matcher = new MyErrorStateMatcher();
    availableTimetables: Timetable[] = [];
    currentStage;
    currentTimetable: Timetable;
    universityClasses: UniversityClassWithDates[] = [];
    areClassesLoading = true;
    isPageLoading = true;

    @ViewChild('calendar') calendarComponent: FullCalendarComponent;
    calendarOptions: CalendarOptions;

    constructor(
        private timetableService: TimetableService,
        private universityClassService: UniversityClassService,
        private router: Router,
        public dialog: MatDialog,
        private authService: AuthenticationService
    ) { }

    ngOnInit(): void {
        this.getTimetables();
        this.calendarOptions = {
            allDaySlot: false,
            height: '70vh',
            initialView: 'timeGridWeek',
            nowIndicator: true,
            locale: 'pl',
            slotMinTime: '06:00:00',
            slotMaxTime: '21:00:00',
            slotDuration: '00:15:00',
            validRange: (nowDate) => {
                return this.setValidCalendarRange();
            },
            firstDay: 1,
            dayHeaderFormat: { weekday: 'long' },
            headerToolbar: {
                start: 'title',
                center: '',
                end: 'prev,next'
            },
            eventClick: (event) => { this.onEventClick(event); },
        };
        this.clearQueryParams();
    }

    getDayOfWeek(val): string {
        return getDayOfWeekByValue(val);
    }

    setValidCalendarRange() {
        const validRange = {
            start: formatDateToAPIFormat(new Date(this.currentTimetable.start_date)),
            end: formatDateToAPIFormat(new Date(this.currentTimetable.end_date))
        };
        return validRange;
    }

    startTimetableCreation(): void {
        this.router.navigate(
            [],
            {
                queryParams: { timetableCreate: 1 },
                queryParamsHandling: 'merge',
            }
        );
        const dialogRef = this.dialog.open(NewTimetableDialogComponent);

        dialogRef.afterClosed().subscribe(resultTimetable => {
            this.clearQueryParams();
            if (resultTimetable) {
                this.availableTimetables.unshift(resultTimetable.activity);
                this.setCurrentTimetable(resultTimetable.activity);
            }
        });
    }

    getTimetables(): void {
        this.timetableService.getTimetables().subscribe(timetables => {
            console.log(timetables);
            timetables = timetables.filter(timetable => timetable.activeFlag === '1');
            if (!timetables.length) {
                this.currentStage = 'no timetable';
                this.isPageLoading = false;
                return;
            }
            this.availableTimetables = timetables;
            this.setCurrentTimetable(timetables[0]);
            this.isPageLoading = false;
        }, error => {
            this.isPageLoading = false;
        });
    }

    getInitialRelatedUniversityClasses(): void {
        this.areClassesLoading = true;
        this.universityClassService.getUniversityClasses(this.currentTimetable.id).subscribe(universityClasses => {
            console.log(universityClasses);
            this.universityClasses = [];
            this.universityClasses = parseActivitiesToUniversityClassesWithDates(universityClasses);
            console.log(this.universityClasses);
            this.buildCalendarEvents();
            this.areClassesLoading = false;
            // const calendarEvents = this.universityClasses.map(universityClass => {
            //     return this.mapUniversityClassToEvent(universityClass);
            // }).forEach(event => {
            //     this.calendarComponent.getApi().addEvent(event);
            // });
        });
    }

    buildCalendarEvents() {
        const eventArray = this.buildEventArrayFromUniversityClasses(this.universityClasses);
        this.calendarComponent.getApi().removeAllEventSources();
        this.calendarComponent.getApi().addEventSource(eventArray);
        console.log(this.calendarComponent.getApi().getEventSources());
    }

    buildEventArrayFromUniversityClasses(universityClassesWithDates: UniversityClassWithDates[]): Array<any> {
        const eventArray = [];
        universityClassesWithDates.forEach(uniClass => {
            eventArray.push(...this.buildEventArrayFromMap(uniClass.dates, uniClass.universityClass));
        });
        console.log(eventArray);
        return eventArray;
    }

    buildEventArrayFromMap(datesMap: Map<number, UniversityClassDate[]>, universityClass: UniversityClass) {
        const eventArray = [];
        datesMap.forEach((value, key) => {
            const mappedDates = value.map(date => {
                return this.mapUniversityClassDateToEvent(date, universityClass);
            })
            eventArray.push(...mappedDates);
        })
        return eventArray;
    }

    getAvailableTimetables() {
        return this.availableTimetables;
    }

    setCurrentTimetable(timetable) {
        this.currentTimetable = timetable;
        this.calendarComponent?.getApi().gotoDate(formatDateToAPIFormat(new Date(this.currentTimetable.start_date)));
        this.getInitialRelatedUniversityClasses();
        this.currentStage = 'current timetable';
    }

    deleteTimetable() {
        this.areClassesLoading = true;
        this.timetableService.deleteTimetable(this.currentTimetable.id)
            .subscribe(result => {
                this.getTimetables();
            }, error => {
                this.areClassesLoading = false;
            })
    }

    openCreateClassDialog(): void {
        this.router.navigate(
            [],
            {
                queryParams: { editClass: 1 },
                queryParamsHandling: 'merge',
            }
        )
        const dialogRef = this.dialog.open(NewUniversityClassDialogComponent, {
            data: {
                currentTimetable: this.currentTimetable
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.clearQueryParams();
            if (result) {
                this.universityClasses.push({
                    universityClass: result.activity,
                    dates: new Map()
                } as UniversityClassWithDates);
            }
        });
    }

    onEventClick(event): void {
        const universityClassToEdit: UniversityClass = event.event.extendedProps.universityClass;
    }

    clearQueryParams() {
        this.router.navigate(
            [],
            {
                queryParams: { editClass: null, timetableCreate: null, datesEdit: null },
                queryParamsHandling: 'merge',
                // skipLocationChange: true,

            }
        );
    }

    openEditClassDialog(universityClassToEdit: UniversityClassWithDates): void {
        this.router.navigate(
            [],
            {
                queryParams: { editClass: 1 },
                queryParamsHandling: 'merge',
            }
        );
        const dialogRef = this.dialog.open(NewUniversityClassDialogComponent, {
            data: {
                currentTimetable: this.currentTimetable,
                universityClassToEdit,
                self: this
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.clearQueryParams();
            if(result) {
                console.log(result);
                result.id = universityClassToEdit.universityClass.id;
                const index = this.universityClasses.findIndex(uniClass => uniClass.universityClass.id === result.id);
                if(result.deleted) {
                    this.universityClasses.splice(index, 1);
                } else {
                    this.universityClasses[index].universityClass = result;
                }
                this.buildCalendarEvents();
            }
        });
    }

    addUniversityClassDate(universityClassDates: Map<number, UniversityClassDate[]>, universityClass: UniversityClass): void {
        const uniClassIndex = this.universityClasses.findIndex(uniClass => uniClass.universityClass.id === universityClass.id);
        this.universityClasses[uniClassIndex].dates = universityClassDates;
        this.buildCalendarEvents();
    }

    mapUniversityClassDateToEvent(date: UniversityClassDate, universityClass: UniversityClass): {} {
        return {
            id: date.id,
            title: universityClass.name,
            start: date.start_date,
            end: date.end_date,
            universityClassDate: date,
            backgroundColor: universityClass.colour,
            borderColor: universityClass.colour
        };
    }

}

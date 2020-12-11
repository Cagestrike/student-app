import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Event } from '../event';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
  selector: 'app-new-calendar-event-dialog',
  templateUrl: './new-calendar-event-dialog.component.html',
  styleUrls: ['./new-calendar-event-dialog.component.css']
})
export class NewCalendarEventDialogComponent implements OnInit {
    priorValue;
    eventNameControl = new FormControl('', [Validators.required]);
    allDayEventControl = new FormControl('', []);
    eventStartDateControl = new FormControl('', [Validators.required]);
    eventStartTimeControl = new FormControl({disabled: false}, [Validators.required]);
    eventEndDateControl = new FormControl('', [Validators.required]);
    eventEndTimeControl = new FormControl('', [Validators.required]);
    eventLocationControl = new FormControl();
    eventDescriptionControl = new FormControl();
    eventColorControl = new FormControl();

    newCalendarEventForm = new FormGroup({
        name: this.eventNameControl,
        eventStartDate: this.eventStartDateControl,
        eventStartTime: this.eventStartTimeControl,
        eventEndDate: this.eventEndDateControl,
        eventEndTime: this.eventEndTimeControl,
        allDayEvent: this.allDayEventControl,
        eventLocation: this.eventLocationControl,
        eveneventDescriptiontLocation: this.eventDescriptionControl,
        eventColor: this.eventColorControl
    });
    matcher = new MyErrorStateMatcher();

    isEditMode = false;
    dialogHeader = 'Nowe Wydarzenie';
    calendarEventToEdit;

    constructor(
        public dialogRef: MatDialogRef<NewCalendarEventDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data
    ) { }

    ngOnInit(): void {
        this.eventColorControl.setValue('#3498DB');
        const calendarEventToEdit: Event = this.data?.eventToEdit;
        this.calendarEventToEdit = calendarEventToEdit;
        if(calendarEventToEdit) {
            let startDate, startTime, endDate, endTime;
            const calendarStartDatetime = new Date(calendarEventToEdit.startDatetime);
            const calendarEndDatetime = new Date(calendarEventToEdit.endDatetime);

            startDate = `${calendarStartDatetime.getFullYear()}-${calendarStartDatetime.getMonth() + 1}-${calendarStartDatetime.getDate()}`;
            endDate = `${calendarEndDatetime.getFullYear()}-${calendarEndDatetime.getMonth() + 1}-${calendarEndDatetime.getDate()}`;
            this.eventStartDateControl.setValue(startDate);
            this.eventEndDateControl.setValue(endDate);

            if(!calendarEventToEdit.allDayEvent) {
                startTime = `${calendarStartDatetime.getHours()}:${calendarStartDatetime.getMinutes()}`;
                endTime = `${calendarEndDatetime.getHours()}:${calendarEndDatetime.getMinutes()}`;
                this.eventStartTimeControl.setValue(startTime);
                this.eventEndTimeControl.setValue(endTime);
            } else {
                this.eventStartTimeControl.disable();
                this.eventEndTimeControl.disable();
            }

            this.isEditMode = true;
            this.dialogHeader = 'Edytuj wydarzenie';
            this.eventNameControl.setValue(calendarEventToEdit.name);
            this.allDayEventControl.setValue(calendarEventToEdit.allDayEvent);
            this.eventLocationControl.setValue(calendarEventToEdit.location);
            this.eventDescriptionControl.setValue(calendarEventToEdit.description);
            this.eventColorControl.setValue(calendarEventToEdit.color);
        }
    }

    handleAllDayEventCheckbox(event) {
        if(event.checked) {
            this.eventStartTimeControl.disable();
            this.eventEndTimeControl.disable();
            this.priorValue = {
                startTime: this.eventStartTimeControl.value,
                endTime: this.eventEndTimeControl.value
            };
            this.eventStartTimeControl.setValue(null);
            this.eventEndTimeControl.setValue(null);
        } else {
            this.eventStartTimeControl.enable();
            this.eventEndTimeControl.enable();
            this.eventStartTimeControl.setValue(this.priorValue?.startTime);
            this.eventEndTimeControl.setValue(this.priorValue?.endTime);
        }
    }

    saveEvent(): void {
        const event = {
            name: this.eventNameControl.value,
            description: this.eventDescriptionControl.value,
            location: this.eventLocationControl.value,
            color: this.eventColorControl.value,
        } as Event;

        if(this.allDayEventControl.value) {
            event.allDayEvent = true;
            event.startDatetime = this.eventStartDateControl.value;
            event.endDatetime = this.eventEndDateControl.value;
        } else {
            event.allDayEvent = false;
            event.startDatetime = new Date(this.eventStartDateControl.value + ' ' + this.eventStartTimeControl.value);
            event.endDatetime = new Date(this.eventEndDateControl.value + ' ' + this.eventEndTimeControl.value);
        }

        if(this.calendarEventToEdit?.id) {
            event.id = this.calendarEventToEdit?.id;
        }

        this.dialogRef.close(event);
    }
}

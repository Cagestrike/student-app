import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
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
    classRoomControl = new FormControl('', [Validators.required]);
    eventStartDateControl = new FormControl('', [Validators.required]);
    eventStartTimeControl = new FormControl({disabled: false}, [Validators.required]);
    eventEndDateControl = new FormControl('', [Validators.required]);
    eventEndTimeControl = new FormControl('', [Validators.required]);
    eventLocationControl = new FormControl();
    eventDescriptionControl = new FormControl();
    
    newCalendarEventForm = new FormGroup({
        name: this.eventNameControl,
        classRoom: this.eventNameControl,
        eventStartDate: this.eventStartDateControl,
        eventStartTime: this.eventStartTimeControl,
        eventEndDate: this.eventEndDateControl,
        eventEndTime: this.eventEndTimeControl,
        allDayEvent: this.allDayEventControl,
        eventLocation: this.eventLocationControl,
        eveneventDescriptiontLocation: this.eventDescriptionControl,
    });
    matcher = new MyErrorStateMatcher();

    constructor(
        public dialogRef: MatDialogRef<NewCalendarEventDialogComponent>
    ) { }

    ngOnInit(): void {
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
            this.eventStartTimeControl.setValue(this.priorValue.startTime);
            this.eventEndTimeControl.setValue(this.priorValue.endTime);
        }
    }

    createEvent(): void {
        const event = {
            name: this.eventNameControl.value,
            description: this.eventDescriptionControl.value,
            location: this.eventLocationControl.value,
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

        this.dialogRef.close(event);
    }
}

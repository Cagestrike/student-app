import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formatDatetimeToAPIFormat, formatDateToAPIFormat, getTimeFromDatetime } from '../api-utils';
import { EventService } from '../event.service';
import { UserEvent } from '../user-event';
import { UserEventDate } from '../user-event-date';

// export class MyErrorStateMatcher implements ErrorStateMatcher {
//     isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//         const isSubmitted = form && form.submitted;
//         return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//     }
// }

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
    eventStartTimeControl = new FormControl('', [Validators.required]);
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

    apiErrors;
    apiKeyToFormControl = new Map()
        .set('name', this.eventNameControl)
        .set('place', this.eventLocationControl)
        .set('description', this.eventDescriptionControl)
        .set('colour', this.eventColorControl)
        .set('start_date', this.newCalendarEventForm)
        .set('end_date', this.newCalendarEventForm);

    isEditMode = false;
    dialogHeader = 'Nowe Wydarzenie';
    genericError = 'Coś poszło nie tak...';
    isDialogLoading = false;

    userEventToEdit: UserEvent;
    eventDateToEdit: UserEventDate;
    otherEventDates: UserEventDate[];

    constructor(
        public dialogRef: MatDialogRef<NewCalendarEventDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private userEventService: EventService,
    ) { }

    ngOnInit(): void {
        this.eventColorControl.setValue('#3498DB');
        this.eventStartDateControl.setValue(new Date());
        this.eventEndDateControl.setValue(new Date());
        this.eventStartTimeControl.setValue(new Date().getHours() + ':' + new Date().getMinutes());
        this.eventEndTimeControl.setValue(new Date().getHours() + 1 + ':' + new Date().getMinutes());

        this.userEventToEdit = this.data?.eventToEdit;
        this.eventDateToEdit = this.data?.eventDateToEdit;
        this.otherEventDates = this.data?.otherEventDates;

        if (this.userEventToEdit && this.eventDateToEdit) {
            this.isEditMode = true;
            this.dialogHeader = 'Edytuj wydarzenie';
            this.eventNameControl.setValue(this.userEventToEdit.name);
            this.eventColorControl.setValue(this.userEventToEdit.colour);
            this.eventLocationControl.setValue(this.userEventToEdit.place);
            this.eventDescriptionControl.setValue(this.userEventToEdit.description);
            this.allDayEventControl.setValue(this.eventDateToEdit.allDay_flag === 1);
            this.handleAllDayEventCheckbox({ checked: this.allDayEventControl.value });
            this.eventStartDateControl.setValue(new Date(this.eventDateToEdit.start_date));
            this.eventEndDateControl.setValue(new Date(this.eventDateToEdit.end_date));
            if (!this.allDayEventControl.value) {
                this.eventStartTimeControl.setValue(getTimeFromDatetime(new Date(this.eventDateToEdit.start_date)));
                this.eventEndTimeControl.setValue(getTimeFromDatetime(new Date(this.eventDateToEdit.end_date)));
            }
        }
    }

    handleAllDayEventCheckbox(event): void {
        if (event.checked) {
            this.eventStartTimeControl.disable();
            this.eventEndTimeControl.disable();
            this.priorValue = {
                startTime: this.eventStartTimeControl.value,
                endTime: this.eventEndTimeControl.value
            };
            this.eventStartTimeControl.setValue(null);
            this.eventEndTimeControl.setValue(null);
            this.eventStartTimeControl.setValidators(null);
            this.eventEndTimeControl.setValidators(null);
            this.eventStartTimeControl.updateValueAndValidity();
            this.eventEndTimeControl.updateValueAndValidity();
        } else {
            this.eventStartTimeControl.enable();
            this.eventEndTimeControl.enable();
            this.eventStartTimeControl.setValue(this.priorValue?.startTime);
            this.eventEndTimeControl.setValue(this.priorValue?.endTime);
            this.eventStartTimeControl.setValidators([Validators.required]);
            this.eventEndTimeControl.setValidators([Validators.required]);
            this.eventStartTimeControl.updateValueAndValidity();
            this.eventEndTimeControl.updateValueAndValidity();
        }
    }

    deleteUserEvent(): void {
        this.isDialogLoading = true;
        this.userEventService.deleteEvent(this.userEventToEdit.id)
            .subscribe(result => {
                this.dialogRef.close({ deleted: true });
                this.isDialogLoading = false;
            }, error => {
                this.isDialogLoading = false;
                this.newCalendarEventForm.setErrors({ genericError: true });
                if (typeof error.error === 'string') {
                    error.error = JSON.parse(error.error);
                }
                console.log(error.error);
                this.apiErrors = error.error;

                if (this.apiErrors.message) {
                    this.newCalendarEventForm.setErrors({ genericApiErrors: true });
                }
            });
    }

    saveEvent(): void {
        if (this.newCalendarEventForm.invalid) {
            return;
        }

        for (const [key, value] of Object.entries(this.newCalendarEventForm.controls)) {
            value.setErrors(null);
        }
        this.apiErrors = null;

        this.newCalendarEventForm.setErrors(null);

        let startDatetime;
        let endDatetime;

        if (this.allDayEventControl.value) {
            startDatetime = new Date(formatDateToAPIFormat(this.eventStartDateControl.value));
            endDatetime = new Date(formatDateToAPIFormat(this.eventEndDateControl.value));
        } else {
            startDatetime = new Date(formatDatetimeToAPIFormat(
                new Date(formatDateToAPIFormat(this.eventStartDateControl.value) + ' ' + this.eventStartTimeControl.value)
            ));
            endDatetime = new Date(formatDatetimeToAPIFormat(
                new Date(formatDateToAPIFormat(this.eventEndDateControl.value) + ' ' + this.eventEndTimeControl.value)
            ));
        }

        if (startDatetime > endDatetime) {
            this.newCalendarEventForm.setErrors({ startDateAfterEndDate: true });
            return;
        }

        const userEvent = {
            name: this.eventNameControl.value,
            colour: this.eventColorControl.value,
        } as UserEvent;

        if (this.eventDescriptionControl.value) {
            userEvent.description = this.eventDescriptionControl.value;
        }
        if (this.eventLocationControl.value) {
            userEvent.place = this.eventLocationControl.value;
        }

        const userEventDate = {} as UserEventDate;

        if (this.allDayEventControl.value) {
            userEventDate.allDay_flag = 1;
            userEventDate.start_date = formatDateToAPIFormat(startDatetime);
            userEventDate.end_date = formatDateToAPIFormat(endDatetime);
        } else {
            userEventDate.allDay_flag = 0;
            userEventDate.start_date = formatDatetimeToAPIFormat(startDatetime);
            userEventDate.end_date = formatDatetimeToAPIFormat(endDatetime);
        }

        this.isDialogLoading = true;
        if (this.isEditMode) {
            this.updateEvent(userEvent, userEventDate);
        } else {
            this.createEvent(userEvent, userEventDate);
        }
    }

    updateEvent(userEvent: UserEvent, userEventDate: UserEventDate): void {
        userEvent.id = this.userEventToEdit.id;
        userEventDate.id = this.eventDateToEdit.id;
        console.log(userEvent);
        console.log(this.userEventToEdit);
        console.log(userEventDate);
        console.log(this.eventDateToEdit);


        if (this.haveEventDatesValuesChanged(userEventDate) && this.haveEventValuesChanged(userEvent)) {
            this.userEventService.updateEvent(userEvent, this.userEventToEdit.id)
                .subscribe(result => {
                    userEvent.id = this.userEventToEdit.id;
                    this.userEventService.updateEventDate(userEventDate, this.eventDateToEdit.id)
                        .subscribe(result => {
                            userEventDate.id = this.eventDateToEdit.id;
                            this.dialogRef.close({ userEvent, userEventDate });
                            this.isDialogLoading = false;
                        }, error => {
                            this.isDialogLoading = false;

                            this.newCalendarEventForm.setErrors({ genericError: true });
                            if (typeof error.error === 'string') {
                                error.error = JSON.parse(error.error);
                            }
                            console.log(error.error);
                            this.apiErrors = error.error;

                            if (this.apiErrors.message) {
                                this.newCalendarEventForm.setErrors({ genericApiErrors: true });
                            }
                            for (const [key, value] of Object.entries(this.apiErrors)) {
                                this.apiKeyToFormControl.get(key)?.setErrors({ apiErrors: true });
                            }
                        });
                }, error => {
                    this.isDialogLoading = false;
                    this.newCalendarEventForm.setErrors({ genericError: true });
                    if (typeof error.error === 'string') {
                        error.error = JSON.parse(error.error);
                    }
                    console.log(error.error);
                    this.apiErrors = error.error;

                    if (this.apiErrors.message) {
                        this.newCalendarEventForm.setErrors({ genericApiErrors: true });
                    }
                    for (const [key, value] of Object.entries(this.apiErrors)) {
                        this.apiKeyToFormControl.get(key)?.setErrors({ apiErrors: true });
                    }
                });
        } else if (this.haveEventValuesChanged(userEvent)) {
            this.userEventService.updateEvent(userEvent, this.userEventToEdit.id)
                .subscribe(result => {
                    userEvent.id = this.userEventToEdit.id;
                    this.isDialogLoading = false;
                    this.dialogRef.close({ userEvent, userEventDate });
                }, error => {
                    this.isDialogLoading = false;
                    this.newCalendarEventForm.setErrors({ genericError: true });
                    if (typeof error.error === 'string') {
                        error.error = JSON.parse(error.error);
                    }
                    console.log(error.error);
                    this.apiErrors = error.error;

                    if (this.apiErrors.message) {
                        this.newCalendarEventForm.setErrors({ genericApiErrors: true });
                    }
                    for (const [key, value] of Object.entries(this.apiErrors)) {
                        this.apiKeyToFormControl.get(key)?.setErrors({ apiErrors: true });
                    }
                });
        } else if (this.haveEventDatesValuesChanged(userEventDate)) {
            this.userEventService.updateEventDate(userEventDate, this.eventDateToEdit.id)
                .subscribe(result => {
                    userEventDate.id = this.eventDateToEdit.id;
                    this.dialogRef.close({ userEvent, userEventDate });
                    this.isDialogLoading = false;
                }, error => {
                    this.isDialogLoading = false;

                    this.newCalendarEventForm.setErrors({ genericError: true });
                    if (typeof error.error === 'string') {
                        error.error = JSON.parse(error.error);
                    }
                    console.log(error.error);
                    this.apiErrors = error.error;

                    if (this.apiErrors.message) {
                        this.newCalendarEventForm.setErrors({ genericApiErrors: true });
                    }
                    for (const [key, value] of Object.entries(this.apiErrors)) {
                        this.apiKeyToFormControl.get(key)?.setErrors({ apiErrors: true });
                    }
                });
        } else {
            console.log('nothing changed');
            this.dialogRef.close({ userEvent, userEventDate });
        }
    }

    haveEventValuesChanged(userEvent: UserEvent): boolean {
        return (
            userEvent.name !== this.userEventToEdit.name
            || userEvent.place !== this.userEventToEdit.place
            || userEvent.description !== this.userEventToEdit.description
            || userEvent.colour !== this.userEventToEdit.colour
        );
    }

    haveEventDatesValuesChanged(userEventDate: UserEventDate): boolean {
        return (
            userEventDate.allDay_flag !== this.eventDateToEdit.allDay_flag
            || userEventDate.start_date !== this.eventDateToEdit.start_date
            || userEventDate.end_date !== this.eventDateToEdit.end_date
        );
    }

    createEvent(userEvent: UserEvent, userEventDate: UserEventDate): void {
        this.userEventService.addEvent(userEvent)
            .subscribe(result => {
                userEvent.id = result.event.id;
                this.userEventService.addEventDate(userEventDate, userEvent.id)
                    .subscribe(result => {
                        userEventDate.id = result.event.id;
                        this.dialogRef.close({ userEvent, userEventDate });
                        this.isDialogLoading = false;
                    }, error => {
                        this.isDialogLoading = false;

                        this.newCalendarEventForm.setErrors({ genericError: true });
                        if (typeof error.error === 'string') {
                            error.error = JSON.parse(error.error);
                        }
                        console.log(error.error);
                        this.apiErrors = error.error;

                        if (this.apiErrors.message) {
                            this.newCalendarEventForm.setErrors({ genericApiErrors: true });
                        }
                        for (const [key, value] of Object.entries(this.apiErrors)) {
                            this.apiKeyToFormControl.get(key)?.setErrors({ apiErrors: true });
                        }
                    });
            }, error => {
                this.isDialogLoading = false;
                this.newCalendarEventForm.setErrors({ genericError: true });
                if (typeof error.error === 'string') {
                    error.error = JSON.parse(error.error);
                }
                console.log(error.error);
                this.apiErrors = error.error;

                if (this.apiErrors.message) {
                    this.newCalendarEventForm.setErrors({ genericApiErrors: true });
                }
                for (const [key, value] of Object.entries(this.apiErrors)) {
                    this.apiKeyToFormControl.get(key)?.setErrors({ apiErrors: true });
                }
            });
    }
}

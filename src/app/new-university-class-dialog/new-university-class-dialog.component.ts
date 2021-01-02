import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UniversityClass } from '../university-class';
import { UniversityClassService } from '../university-class.service';
import { DayOfWeek, DAYS_OF_WEEK } from "../days-of-week";
import { UniversityClassDate } from '../university-class-date';
import { UniversityClassWithDates } from '../university-class-with-dates';
import { EditUniversityClassDatesDialogComponent } from '../edit-university-class-dates-dialog/edit-university-class-dates-dialog.component';

// export class MyErrorStateMatcher implements ErrorStateMatcher {
//     isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
//         const isSubmitted = form && form.submitted;
//         return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
//     }
// }



@Component({
    selector: 'app-new-university-class-dialog',
    templateUrl: './new-university-class-dialog.component.html',
    styleUrls: ['./new-university-class-dialog.component.css']
})
export class NewUniversityClassDialogComponent implements OnInit {
    classNameControl = new FormControl('', [Validators.required]);
    classRoomControl = new FormControl('', [Validators.required]);
    classDescriptionControl = new FormControl();
    classColorControl = new FormControl();
    newUniversityClassForm = new FormGroup({
        name: this.classNameControl,
        classRoom: this.classRoomControl,
        color: this.classColorControl,
        description: this.classDescriptionControl
    });
    isLoading = false;


    apiKeyToFormControl = new Map()
        .set('name', this.classNameControl)
        .set('place', this.classRoomControl)
        .set('colour', this.classColorControl)
        .set('description', this.classDescriptionControl);

    currentTimetable;

    daysOfWeek: DayOfWeek[] = DAYS_OF_WEEK;

    isEditMode = false;
    dialogHeader = 'Nowy Przedmiot';
    universityClassToEdit;
    universityClassDates;
    apiErrors: any;
    genericError = 'Coś poszło nie tak...';
    timetableComponent;

    constructor(
        public dialogRef: MatDialogRef<NewUniversityClassDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private universityClassService: UniversityClassService,
        public dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.timetableComponent = this.data?.self;

        const universityClassToEdit: UniversityClassWithDates = this.data?.universityClassToEdit;
        this.universityClassDates = universityClassToEdit?.dates;
        this.currentTimetable = this.data?.currentTimetable;

        this.universityClassToEdit = universityClassToEdit?.universityClass;
        this.classColorControl.setValue('#3498DB');

        if (this.data?.universityClassToEdit) {
            this.isEditMode = true;
            this.dialogHeader = 'Edytuj Przedmiot';
            this.classNameControl.setValue(this.universityClassToEdit.name);
            this.classRoomControl.setValue(this.universityClassToEdit.place);
            this.classColorControl.setValue(this.universityClassToEdit.colour);
            this.classDescriptionControl.setValue(this.universityClassToEdit.description);
        }
    }

    deleteUniversityClass() {
        this.newUniversityClassForm.setErrors(null);
        this.isLoading = true;
        this.universityClassService.deleteUniversityClass(this.universityClassToEdit?.id)
            .subscribe(result => {
                this.dialogRef.close({ deleted: true });
                this.isLoading = false;
            }, error => {
                this.isLoading = false;
                this.newUniversityClassForm.setErrors({ genericError: true });
            })
    }

    saveUniversityClass(): void {
        if (this.newUniversityClassForm.invalid) {
            return;
        }

        this.newUniversityClassForm.setErrors(null);
        this.apiErrors = null;
        for (const [key, value] of Object.entries(this.newUniversityClassForm.controls)) {
            value.setErrors(null);
        }

        this.isLoading = true;

        let description = this.classDescriptionControl.value;
        if (!description) {
            description = 'some description';
        }
        const newUniversityClass = {
            place: this.classRoomControl.value,
            name: this.classNameControl.value,
            colour: this.classColorControl.value,
            category: 'some category',
            description
        } as UniversityClass;

        // if (this.universityClassToEdit?.id) {
        //     newUniversityClass.id = this.universityClassToEdit.id;
        // }

        if (this.universityClassToEdit?.id) {
            this.putUniversityClass(newUniversityClass, this.universityClassToEdit.id);
        } else {
            this.postUniversityClass(newUniversityClass);
        }
    }

    putUniversityClass(universityClass: UniversityClass, id) {
        this.universityClassService.updateUniversityClass(universityClass, id)
            .subscribe(result => {
                this.dialogRef.close(universityClass);
            }, error => {
                this.isLoading = false;
                this.newUniversityClassForm.setErrors({ genericError: true });
                if (typeof error.error === 'string') {
                    error.error = JSON.parse(error.error);
                }
                console.log(error.error);
                this.apiErrors = error.error;

                for (const [key, value] of Object.entries(this.apiErrors)) {
                    this.apiKeyToFormControl.get(key)?.setErrors({ apiErrors: true });
                }
                this.isLoading = false;
            })
    }

    openEditUniversityClassDatesDialog() {
        const dialogRef = this.dialog.open(EditUniversityClassDatesDialogComponent, {
            data: {
                timetable: this.currentTimetable,
                universityClass: this.universityClassToEdit,
                universityClassDates: this.universityClassDates,
                timetableComponent: this.timetableComponent
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }

    postUniversityClass(universityClass: UniversityClass) {
        this.universityClassService.addUniversityClass(universityClass, this.currentTimetable.id)
            .subscribe(result => {
                this.dialogRef.close(result);
            }, error => {
                this.isLoading = false;
                this.newUniversityClassForm.setErrors({ genericError: true });
                if (typeof error.error === 'string') {
                    error.error = JSON.parse(error.error);
                }
                console.log(error.error);
                this.apiErrors = error.error;

                for (const [key, value] of Object.entries(this.apiErrors)) {
                    this.apiKeyToFormControl.get(key)?.setErrors({ apiErrors: true });
                }

            })
    }

}

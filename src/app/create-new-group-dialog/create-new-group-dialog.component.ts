import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from '../group';
import { GroupService } from '../group.service';

@Component({
    selector: 'app-create-new-group-dialog',
    templateUrl: './create-new-group-dialog.component.html',
    styleUrls: ['./create-new-group-dialog.component.css']
})
export class CreateNewGroupDialogComponent implements OnInit {
    groupNameControl = new FormControl('', [Validators.required]);
    groupDescriptionControl = new FormControl('', []);
    newGroupForm = new FormGroup({
        groupName: this.groupNameControl,
        groupDescription: this.groupDescriptionControl
    });

    isLoading;

    apiKeyToFormControl = new Map()
        .set('name', this.groupNameControl)
        .set('description', this.groupDescriptionControl);
    apiErrors;

    constructor(
        public dialogRef: MatDialogRef<CreateNewGroupDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data,
        private groupService: GroupService
    ) { }

    ngOnInit(): void {
    }

    saveGroup(): void {
        if (this.newGroupForm.invalid) {
            return;
        }

        for (const [key, value] of Object.entries(this.newGroupForm.controls)) {
            value.setErrors(null);
        }
        this.apiErrors = null;
        this.newGroupForm.setErrors(null);

        const group = {
            name: this.groupNameControl.value,
            description: this.groupDescriptionControl.value
        } as Group;

        this.isLoading = true;
        this.groupService.createGroup(group)
            .subscribe(result => {
                this.isLoading = false;
                this.dialogRef.close({refreshGroups: true});
            }, error => {
                this.newGroupForm.setErrors({ genericError: true });
                if (typeof error.error === 'string') {
                    error.error = JSON.parse(error.error);
                }
                console.log(error.error);
                this.apiErrors = error.error;

                if (this.apiErrors.message) {
                    this.newGroupForm.setErrors({ genericApiErrors: true });
                }
                for (const [key, value] of Object.entries(this.apiErrors)) {
                    this.apiKeyToFormControl.get(key)?.setErrors({ apiErrors: true });
                }

                this.isLoading = false;
            });
    }

    cancel(): void {
        this.dialogRef.close({ refreshGroups: false });
    }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Group } from '../group';
import { GroupService } from '../group.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-group-details',
    templateUrl: './group-details.component.html',
    styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {
    @ViewChild('groupPictureInput') groupPictureInput;
    group: Group;
    groupPicture;
    apiErrors;
    imageErrors;
    nameControl = new FormControl();
    descriptionControl = new FormControl();
    currentGroupPicture;
    newPictureUploaded;
    apiKeyToFormControl = new Map()
        .set('name', this.nameControl)
        .set('description', this.descriptionControl)

    groupForm = new FormGroup({
        name: this.nameControl,
        description: this.descriptionControl,
    });    

    isLoading;
    isPhotoLoading;

    constructor(
        private groupService: GroupService,
        private route: ActivatedRoute,
        private location: Location
    ) { }

    ngOnInit(): void {
        const groupId = this.route.snapshot.paramMap.get('id');
        this.getGroupDetails(groupId);
    }

    getGroupDetails(groupId) {
        this.isLoading = true;
        this.groupService.getGroupDetails(groupId)
            .subscribe(result => {
                this.group = result[0];
                console.log(result);
                this.nameControl.setValue(this.group.name);
                this.descriptionControl.setValue(this.group.description);
                this.currentGroupPicture = this.group.picture;
                this.isLoading = false;
            }, error => {
                this.location.back();
            })
    }

    updateGroupData() {
        this.isLoading = true;
        const group = {
            name: this.nameControl.value,
            description: this.descriptionControl.value
        } as Group;

        this.groupService.updateGroup(this.group.id, group).subscribe(result => {
            console.log(result);
            this.group = result.group;
            this.isLoading = false;
        }, error => {
            this.groupForm.setErrors({ genericError: true });
                if (typeof error.error === 'string') {
                    error.error = JSON.parse(error.error);
                }
                console.log(error.error);
                this.apiErrors = error.error;

                if (this.apiErrors.message) {
                    this.groupForm.setErrors({ genericApiErrors: true });
                }
                for (const [key, value] of Object.entries(this.apiErrors)) {
                    this.apiKeyToFormControl.get(key)?.setErrors({ apiErrors: true });
                }

                this.isLoading = false;
        })

    }

    deleteGroup() {

    }

    onGroupPictureChanged(event) {
        console.log(event);
        if (event.target.files.length > 0) {
            this.newPictureUploaded = true;
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                this.currentGroupPicture = reader.result;
            }

            reader.readAsDataURL(file);
        } else {
            this.cancelNewPhoto();
        }
    }

    saveNewPhoto() {
        this.isPhotoLoading = true;
        this.imageErrors = null;
        console.log(this.groupPictureInput.nativeElement.files[0]);
        console.log(this.currentGroupPicture);
        this.groupService.addGroupPhoto(this.groupPictureInput.nativeElement.files[0], this.group.id)
            .subscribe(result => {
                // this.cancelNewPhoto();
                this.groupPictureInput.nativeElement.value = null;
                this.newPictureUploaded = false;
                this.imageErrors = null;
                this.isPhotoLoading = false;
                // this.userService.clearUserProfilePic();
                // this.getPicture();
            }, error => {
                console.log(error);
                this.imageErrors = error.error.error.name[0];
                this.isPhotoLoading = false;
            })
    }

    cancelNewPhoto() {
        this.newPictureUploaded = false;
        this.currentGroupPicture = this.group.picture;
        this.groupPictureInput.nativeElement.value = null;
        this.imageErrors = null;
    }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDateToAPIFormat } from '../api-utils';
import { AuthenticationService } from '../authentication.service';
import { UserService } from '../user.service';

export interface User {
    id;
    name;
    secondName;
    profileDesc;
    profilePic;
    birthday;
    email;
}

export interface UserPicture {
    PictureId;
    name;
    picUrl;
}

@Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
    @ViewChild('profilePictureInput') profilePictureInput;
    user: User;
    userPicture: UserPicture[];
    apiErrors;
    imageErrors;
    nameControl = new FormControl();
    secondNameControl = new FormControl();
    profileDescriptionControl = new FormControl();
    birthdateControl = new FormControl();
    currentUserPicture;
    newPictureUploaded;
    apiKeyToFormControl = new Map()
        .set('name', this.nameControl)
        .set('secondName', this.secondNameControl)
        .set('profileDesc', this.profileDescriptionControl)
        .set('birthday', this.birthdateControl)

    userForm = new FormGroup({
        name: this.nameControl,
        surname: this.secondNameControl,
        description: this.profileDescriptionControl,
        birthday: this.birthdateControl,
    });

    isLoading;
    isPhotoLoading;

    constructor(
        private userService: UserService,
        private authService: AuthenticationService,
        private snackBar: MatSnackBar,
    ) { }

    ngOnInit(): void {
        this.getUser();
        this.getPicture();
    }

    getUser() {
        this.isLoading = true;
        this.userService.getCurrentUserFromServer().subscribe(result => {
            console.log(result);
            this.user = result;
            this.nameControl.setValue(this.user.name);
            this.secondNameControl.setValue(this.user.secondName);
            this.profileDescriptionControl.setValue(this.user.profileDesc);
            this.birthdateControl.setValue(this.user.birthday);
            this.isLoading = false;
        }, error => {
            console.log(error);
            this.isLoading = false;
        });
    }

    getPicture(): void {
        this.isPhotoLoading = true;
        this.userService.getUserProfilePic()
            .subscribe(result => {
                console.log(result);
                this.userPicture = result;
                if (this.userPicture && this.userPicture.length > 0) {
                    this.currentUserPicture = this.userPicture[0].picUrl;
                }
                this.isPhotoLoading = false;
            }, error => {
                console.log(error);
                this.isPhotoLoading = false;
            })
    }

    deleteUser() {
        this.isLoading = true;
        this.userService.deleteUser().subscribe(result => {
            this.isLoading = false;
            this.authService.logout();
        }, error => {
            console.log(error);
            this.snackBar.open(error.error, null, {
                duration: 3500
            });
            this.isLoading = false;
        })
    }

    updateUserData() {
        if (this.userForm.invalid) {
            return;
        }

        this.userForm.setErrors(null);
        this.apiErrors = null;
        for (const [key, value] of Object.entries(this.userForm.controls)) {
            value.setErrors(null);
        }

        this.isLoading = true;
        const user = {
            name: this.nameControl.value,
            secondName: this.secondNameControl.value,
            birthday: formatDateToAPIFormat(new Date(this.birthdateControl.value)),
            profileDesc: this.profileDescriptionControl.value
        } as User;

        this.userService.updateUser(user)
            .subscribe(result => {
                console.log(result);
                this.user = result.user;
                this.userService.setCurrentUser(this.user);
                this.isLoading = false;
            }, error => {
                if (typeof error.error === 'string') {
                    this.apiErrors = JSON.parse(error.error);
                } else {
                    this.apiErrors = error.error;
                }
                console.error(this.apiErrors);

                if (this.apiErrors.message) {
                    this.userForm.setErrors({ apiErrors: true });
                }
                for (const [key, value] of Object.entries(this.apiErrors)) {
                    this.apiKeyToFormControl.get(key).setErrors({ apiErrors: true });
                }
                this.isLoading = false;
            })
    }

    onUserPictureChange(event) {
        console.log(event);
        if (event.target.files.length > 0) {
            this.newPictureUploaded = true;
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                this.currentUserPicture = reader.result;
            }

            reader.readAsDataURL(file);
        } else {
            this.cancelNewPhoto();
        }
    }

    saveNewPhoto() {
        this.isPhotoLoading = true;
        this.imageErrors = null;
        // console.log(this.profilePictureInput.nativeElement.files[0]);
        // console.log(this.currentUserPicture);
        this.userService.addUserProfilePic(this.profilePictureInput.nativeElement.files[0])
            .subscribe(result => {
                // this.cancelNewPhoto();
                this.profilePictureInput.nativeElement.value = null;
                this.newPictureUploaded = false;
                this.imageErrors = null;
                this.isPhotoLoading = false;
                this.userService.clearUserProfilePic();
                this.getPicture();
            }, error => {
                console.log(error);
                this.imageErrors = error.error.error.name[0];
                this.isPhotoLoading = false;
            })
    }

    cancelNewPhoto() {
        this.newPictureUploaded = false;
        this.currentUserPicture = this.userPicture[0]?.picUrl;
        this.profilePictureInput.nativeElement.value = null;
        this.imageErrors = null;
    }

    deletePhoto() {
        this.isPhotoLoading = true;
        this.userService.deleteUserPicture(this.userPicture[0].PictureId)
            .subscribe(result => {
                this.userService.clearUserProfilePic();
                this.currentUserPicture = null;
                this.getPicture();
                console.log(result);
            }, error => {
                console.log(error); 
                this.isPhotoLoading = false;
            })
    }
}

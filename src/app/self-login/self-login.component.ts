import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { read } from 'fs';
import { formatDateToAPIFormat } from '../api-utils';
import { AuthenticationService } from '../authentication.service';
import { UserService } from '../user.service';

@Component({
    selector: 'app-self-login',
    templateUrl: './self-login.component.html',
    styleUrls: ['./self-login.component.css']
})
export class SelfLoginComponent implements OnInit {
    emailControl = new FormControl('', [Validators.required]);
    passwordControl = new FormControl('', [Validators.required]);
    loginForm = new FormGroup({
        email: this.emailControl,
        password: this.passwordControl
    });

    @Output() loading = new EventEmitter();

    apiErrors;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
    ) { }

    ngOnInit(): void {
    }

    showFile(event) {
        console.log(event.target.files[0]);
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            console.log('reader result');
        
            console.log(reader.result.toString().split(',')[1]);
        }
        // reader.addEventListener("load", function () {
        //     // convert image file to base64 string
        //     preview.src = reader.result;
        //   }, false);
        
        reader.readAsDataURL(file);
          
    }


    onSubmit() {
        this.loginForm.setErrors(null);
        this.apiErrors = null;

        if (this.loginForm.invalid) {
            return;
        }

        this.loading.emit(true);
        this.authenticationService.login(this.emailControl.value, this.passwordControl.value)
            .subscribe(loginResult => {
                this.authenticationService.setToken(loginResult.token);
                this.authenticationService.startRefreshTokenTimer();
                this.userService.setCurrentUser(loginResult["0"]);
                this.router.navigateByUrl('/dashboard');
                this.loading.emit(false);
            }, error => {
                if (typeof error.error === 'string') {
                    this.apiErrors = JSON.parse(error.error);
                } else {
                    this.apiErrors = error.error;
                }

                console.error(this.apiErrors);
                this.loginForm.setErrors({ apiErrors: true });
                this.loading.emit(false);
            })
    }
}

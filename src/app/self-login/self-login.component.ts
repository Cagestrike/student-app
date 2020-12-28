import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    
    apiErrors;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
    ) { }

    ngOnInit(): void {
    }

    onSubmit() {
        this.loginForm.setErrors(null);
        this.apiErrors = null;

        if(this.loginForm.invalid) {
            return;
        }

        this.authenticationService.login(this.emailControl.value, this.passwordControl.value)
            .subscribe(loginResult => {
                this.authenticationService.setToken(loginResult.token);
                this.userService.setCurrentUser(loginResult["0"]);
                this.router.navigateByUrl('/dashboard');
            }, error => {
                if(typeof error.error === 'string') {
                    this.apiErrors = JSON.parse(error.error);
                } else {
                    this.apiErrors = error.error;
                }

                console.error(this.apiErrors);
                this.loginForm.setErrors({apiErrors: true});
            })
    }
}

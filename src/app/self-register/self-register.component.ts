import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthenticationService } from '../authentication.service';
import { formatDateToAPIFormat } from '../api-utils';
import { Router } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return control.parent.invalid && control.touched;
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

@Component({
    selector: 'app-self-register',
    templateUrl: './self-register.component.html',
    styleUrls: ['./self-register.component.css']
})
export class SelfRegisterComponent implements OnInit {
    matcher = new MyErrorStateMatcher();
    apiErrors;
    nameControl = new FormControl('', [Validators.required]);
    surnameControl = new FormControl('', [Validators.required]);
    emailControl = new FormControl('', [Validators.required]);
    passwordControl = new FormControl('', [Validators.required]);
    confirmationPasswordControl = new FormControl();
    birthdateControl = new FormControl('', [Validators.required]);

    registerForm: FormGroup;
    apiKeyToFormControl = new Map()
                         .set('name', this.nameControl)
                         .set('secondName', this.surnameControl)
                         .set('password', this.passwordControl)
                         .set('passwordConfirmation', this.confirmationPasswordControl)
                         .set('email', this.emailControl)
                         .set('birthday', this.birthdateControl);

    checkPasswords(group: FormGroup) {
        const password = group.get('password').value;
        const confirmationPassword = group.get('confirmationPassword').value;
        
        return password === confirmationPassword ? null : { notSame: true }
    }

    constructor(
        private formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private router: Router
    ) { }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            name: this.nameControl,
            surname: this.surnameControl,
            email: this.emailControl,
            password: this.passwordControl,
            confirmationPassword: this.confirmationPasswordControl,
            birthdate: this.birthdateControl
        }, { validator: MustMatch('password', 'confirmationPassword') });
    }

    // {
    //     "name": "pawel",
    //     "email": "test@gmail.com", 
    //     "password": "haslo123",
    //     "passwordConfirmation":"haslo123",
    //     "secondName": "lejb",
    //     "birthday": "2020-10-10",
    //     "VerySecureKey": "abcd"
    //     }
        
    login(email, password) {
        this.authenticationService.login(email, password)
            .subscribe(loginResult => {
                console.log(loginResult);
                this.authenticationService.setToken(loginResult.token);
                this.router.navigateByUrl('/dashboard');
            }, error => {
                console.error(error);
            })
    }

    onSubmit() {
        if(this.registerForm.invalid) {
            return;
        }
        this.registerForm.setErrors(null);
        this.apiErrors = null;
        for(const [key, value] of Object.entries(this.registerForm.controls)) {
            value.setErrors(null);
        }

        const newUserData = {
            name: this.nameControl.value,
            secondName: this.surnameControl.value,
            email: this.emailControl.value,
            password: this.passwordControl.value,
            passwordConfirmation: this.confirmationPasswordControl.value,
            birthday: formatDateToAPIFormat(new Date(this.birthdateControl.value)),
            VerySecureKey: 'abcd'
        }

        this.authenticationService.register(newUserData)
            .subscribe(registerResult => {
                this.login(newUserData.email, newUserData.password);
            }, error => {
                if(typeof error.error === 'string') {
                    this.apiErrors = JSON.parse(error.error);
                } else {
                    this.apiErrors = error.error;
                }
                console.error(this.apiErrors);
                
                if(this.apiErrors.message) {
                    this.registerForm.setErrors({apiErrors: true});
                }
                for(const [key, value] of Object.entries(this.apiErrors)) {
                    this.apiKeyToFormControl.get(key).setErrors({apiErrors: true});
                }
            })
    }
}

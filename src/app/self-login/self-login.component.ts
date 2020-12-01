import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-self-login',
  templateUrl: './self-login.component.html',
  styleUrls: ['./self-login.component.css']
})
export class SelfLoginComponent implements OnInit {
  email;
  password;
  error;

  constructor(private router: Router, private authentication: AuthenticationService) { }

  ngOnInit(): void {
  }

  tryLogin(event): void {
    event.preventDefault();
    this.authentication.login(this.email, this.password).subscribe(successResponse => {
      if(successResponse.token) {
        this.authentication.setToken(successResponse.token);
        this.router.navigateByUrl('/dashboard');
        this.error = null;
      }
    }, errorResponse => {
      this.error = errorResponse.error.error;
      console.log(errorResponse.error.error);
    });
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent implements OnInit {
  isLoginMode = true;

  constructor() { }

  ngOnInit() {
  }

  onLoginButtonClick(event) {
    this.isLoginMode = true;
  }

  onRegisterButtonClick(event) {
    this.isLoginMode = false;
  }
}

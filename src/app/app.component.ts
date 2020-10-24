import { Component } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.isLoggedIn = this.authService.isLoggedIn();
    router.events.subscribe((val) => {
      if(val instanceof NavigationEnd) {
        this.isLoggedIn = this.authService.isLoggedIn();
      }
  });
  }
}

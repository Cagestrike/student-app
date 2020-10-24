import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialLoginComponent } from './social-login/social-login.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SelfLoginComponent } from './self-login/self-login.component';
import { SelfRegisterComponent } from './self-register/self-register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth-guard';
import { LoggedInAuthGuard } from './logged-in-auth-guard';
import { TopBarComponent } from './top-bar/top-bar.component';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';

@NgModule({
  declarations: [				
    AppComponent,
      LoginPageComponent,
      SocialLoginComponent,
      SelfLoginComponent,
      SelfRegisterComponent,
      DashboardComponent,
      TopBarComponent,
      SideNavbarComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
    MatButtonModule,
    MatInputModule,
    FormsModule
  ],
  providers: [
    AuthGuard,
    LoggedInAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

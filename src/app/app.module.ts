import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialLoginComponent } from './social-login/social-login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { TimetableComponent } from './timetable/timetable.component';
import { CalendarComponent } from './calendar/calendar.component';
import { NotesComponent } from './notes/notes.component';
import { GroupsComponent } from './groups/groups.component';
import { CurrentTimetableComponent } from './current-timetable/current-timetable.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NewUniversityClassDialogComponent } from './new-university-class-dialog/new-university-class-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NewCalendarEventDialogComponent } from './new-calendar-event-dialog/new-calendar-event-dialog.component';
import { MatNativeDateModule } from '@angular/material/core';
import { NoteDialogComponent } from './note-dialog/note-dialog.component';
import { QuillModule } from 'ngx-quill';
import { SafeHtmlPipe } from './safe-html.pipe';
// import { NgMasonryGridModule } from 'ng-masonry-grid';
import { NgxMasonryModule } from 'ngx-masonry';
import { NoteComponent } from './note/note.component';
import { DashboardEventDetailsComponent } from './dashboard-event-details/dashboard-event-details.component';
import { AuthInterceptor } from './auth.interceptor';
import { NewTimetableDialogComponent } from './new-timetable-dialog/new-timetable-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { EditUniversityClassDatesDialogComponent } from './edit-university-class-dates-dialog/edit-university-class-dates-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from './spinner/spinner.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
    dayGridPlugin,
    timeGridPlugin
]);

@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        SocialLoginComponent,
        SelfLoginComponent,
        SelfRegisterComponent,
        DashboardComponent,
        TopBarComponent,
        SideNavbarComponent,
        TimetableComponent,
        CalendarComponent,
        NotesComponent,
        GroupsComponent,
        CurrentTimetableComponent,
        NewUniversityClassDialogComponent,
        NewCalendarEventDialogComponent,
        NoteDialogComponent,
        SafeHtmlPipe,
        NoteComponent,
        DashboardEventDetailsComponent,
        NewTimetableDialogComponent,
        EditUniversityClassDatesDialogComponent,
        SpinnerComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientInMemoryWebApiModule.forRoot(
            InMemoryDataService, { dataEncapsulation: false, passThruUnknownUrl: true }
        ),
        AngularSvgIconModule.forRoot(),
        MatButtonModule,
        MatInputModule,
        MatDialogModule,
        MatSelectModule,
        MatCheckboxModule,
        MatDatepickerModule,
        FormsModule,
        ReactiveFormsModule,
        FullCalendarModule,
        MatNativeDateModule,
        QuillModule.forRoot(),
        // NgMasonryGridModule,
        NgxMasonryModule,
        MatIconModule,
        MatExpansionModule,
        MatDividerModule,
        MatProgressSpinnerModule
    ],
    providers: [
        AuthGuard,
        LoggedInAuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

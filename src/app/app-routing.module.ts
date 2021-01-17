import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { TimetableComponent } from './timetable/timetable.component';
import { CalendarComponent } from './calendar/calendar.component';
import { NotesComponent } from './notes/notes.component';
import { GroupsComponent } from './groups/groups.component';
import { AuthGuard } from './auth-guard';
import { LoggedInAuthGuard } from './logged-in-auth-guard';
import { CurrentTimetableComponent } from './current-timetable/current-timetable.component';
import { PostsComponent } from './posts/posts.component';
import { MyProfileComponent } from './my-profile/my-profile.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'timetable', component: TimetableComponent, canActivate: [AuthGuard], children: [
    {
      path: 'current', component: CurrentTimetableComponent, canActivate: [AuthGuard]
    }
  ] },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'notes', component: NotesComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: MyProfileComponent, canActivate: [AuthGuard] },
  { path: 'groups', component: GroupsComponent, canActivate: [AuthGuard], children: [
    //   {
    //       path: 'all',
    //       component: PostsComponent,
    //       canActivate: [AuthGuard]
    //   },
    //   {
    //       path: ':id',
    //       component: PostsComponent,
    //       canActivate: [AuthGuard]
    //   }
  ] },
  { path: 'login', component: LoginPageComponent, canActivate: [LoggedInAuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

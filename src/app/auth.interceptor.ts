import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { catchError, flatMap, mergeMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthenticationService
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.authService.getToken();
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.authService.getToken()}`
                }
            });
        }

        // if (request.url.indexOf('refresh') !== -1) {
        //     return next.handle(request);
        // }
        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {

                if (err.status === 401) {
                    console.log('unauthorized, logging out...');
                    this.authService.logout();
                }
                return throwError(err);
            })
        );
    }
}


//Genrate params for token refreshing
// (data: any) => {
//     //If reload successful update tokens
//     if (data.status == 200) {
//         //Update tokens
//         localStorange.setItem("api-token", data.result.token);
//         localStorange.setItem("refreshToken", data.result.refreshToken);
//         //Clone our fieled request ant try to resend it
//         req = req.clone({
//             setHeaders: {
//                 'api-token': data.result.token
//             }
//         });
//         return next.handle(req).catch(err => {
//             //Catch another error
//         });
//     } else {
//         //Logout from account
//     }
// }


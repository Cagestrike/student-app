import {CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthenticationService, private router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(this.authService.isLoggedIn()) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}

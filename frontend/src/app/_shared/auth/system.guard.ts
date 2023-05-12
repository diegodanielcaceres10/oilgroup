import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';

@Injectable({
    providedIn: 'root'
})
export class SystemGuard implements CanActivate {

    constructor(
        private Router: Router,
        private userService: UserService,
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.checkUserisSystemAdminLoggedIn();
    }

    checkUserisSystemAdminLoggedIn() {
        if (this.userService.isSystemAdminLoggedIn()) {
            return true;
        }
        this.Router.navigateByUrl('login');
        return false;
    }

}

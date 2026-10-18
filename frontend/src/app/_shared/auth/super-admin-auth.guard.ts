import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class SuperAdminAuthGuard {

    constructor(
        private Router: Router,
        private AuthService: AuthService,
    ) { }

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.checkUserisSuperAdminLoggedIn();
    }

    checkUserisSuperAdminLoggedIn() {
        if (this.AuthService.isSuperAdminLoggedIn()) {
            return true;
        }
        this.Router.navigateByUrl('login');
        return false;
    }

}

import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard {

    constructor(
        private Router: Router,
        private AuthService: AuthService,
    ) { }

    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.checkUserIsLoggedIn()
    }

    async checkUserIsLoggedIn() {
        const auth = await this.AuthService.isLoggedIn();
        if (auth) {
            this.Router.navigateByUrl('panel');
            return false;
        }
        return true;
    }

}

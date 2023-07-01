import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class LicenseAuthGuard implements CanActivate {

    constructor(
        private Router: Router,
        private AuthService: AuthService,
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.checkUserIsLicenseActive();
    }

    async checkUserIsLicenseActive() {
        if (this.AuthService.isLicenseActive()) {
            return true;
        }
        this.Router.navigateByUrl('panel');
        return false;
    }

}

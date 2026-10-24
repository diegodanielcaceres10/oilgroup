import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';
import { Credentials, LoginResponse, Session, TokenResponse } from '../models/session';

import { lastValueFrom } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    progress = new EventEmitter<any>()

    public user: Session | null = null

    constructor(
        private Router: Router,
        private api: ApiService,
    ) { }

    /**
     * logIn
     */
    public async logIn(user: Credentials): Promise<string> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<LoginResponse>("auth/login/", user)).then((user) => {
                if (user.status == "success") {
                    sessionStorage.setItem("oilgroupAccessToken", user.token);
                    this.api.setToken(user.token, user.data && user.data.username);
                    this.user = user.data
                }
                resolve(user.status)
            }).catch((error) => {
                reject(error)
            })
        });
    }

    /**
     * isLoggedIn
     */
    public isLoggedIn() {
        return new Promise<boolean>((resolve) => {
            if (this.user) {
                resolve(true);
            } else {
                const token = sessionStorage.getItem("oilgroupAccessToken");
                if (token) {
                    lastValueFrom(this.api.post<TokenResponse>("auth/token/", { token })).then((user) => {
                        if (user.status == "success") {
                            this.api.setToken(token, user.data && user.data.username);
                            this.user = user.data;
                            resolve(true);
                        } else {
                            sessionStorage.removeItem("oilgroupAccessToken");
                            resolve(false);
                        }
                    }).catch(() => {
                        sessionStorage.removeItem("oilgroupAccessToken");
                        resolve(false);
                    })
                } else {
                    resolve(false);
                }
            }
        });
    }

    /**
     * isLicenseActive
     */
    public isLicenseActive() {
        return this.user && this.user.license && this.user.license.active;
    }

    /**
     * isSystemAdminLoggedIn
     */
    public isSystemAdminLoggedIn(): boolean {
        return !!(this.user && this.user.type == "admin" && ["Super Administrador"].indexOf(this.user.role) >= 0);
    }

    /**
     * isSuperAdminLoggedIn
     */
    public isSuperAdminLoggedIn(): boolean {
        return !!(this.user && ["Super Administrador"].indexOf(this.user.role) >= 0);
    }

    /**
     * isAdminLoggedIn
     */
    public isAdminLoggedIn(): boolean {
        return !!(this.user && ["Super Administrador", "Administrador"].indexOf(this.user.role) >= 0);
    }

    /**
     * logOut
     */
    public async logOut() {
        this.user = null
        sessionStorage.removeItem("oilgroupAccessToken");
        sessionStorage.removeItem("oilgroup-buy");
        sessionStorage.removeItem("oilgroup-sale");
        this.Router.navigateByUrl('login');
    }

    /**
     * getUser
     */
    /** The logged-in user. Only call it once the route guards have confirmed the login. */
    public getUser(): Session {
        return this.user as Session;
    }
}

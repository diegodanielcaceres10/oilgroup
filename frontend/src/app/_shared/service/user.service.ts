import { Injectable, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    @Output() progress: EventEmitter<any> = new EventEmitter()

    public user: any = null

    constructor(
        private Router: Router,
        private api: ApiService,
    ) { }

    /**
     * getCurrentSession
     */
    public getCurrentSession(): any {
        this.user = JSON.parse(sessionStorage.getItem("oilgroupAccessToken")) || null
    }

    /**
     * logIn
     */
    public async logIn(user) {
        return new Promise((resolve, reject) => {
            this.api.post("user/login/", user).toPromise().then((user: any) => {
                if (user.status == "success") {
                    sessionStorage.setItem("oilgroupAccessToken", JSON.stringify(user.data))
                    this.user = user.data
                }
                resolve(user.status)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * isLoggedIn
     */
    public isLoggedIn(): boolean {
        if (this.user) {
            return true
        }
        return false
    }

    /**
     * isLoggedIn
     */
    public isSystemAdminLoggedIn(): boolean {
        if (this.user && this.user.type == "admin" && ["Super Administrador"].indexOf(this.user.role) > -1) {
            return true
        }
        return false
    }
    /**
     * isLoggedIn
     */
    public isSuperAdminLoggedIn(): boolean {
        if (this.user && ["Super Administrador"].indexOf(this.user.role) > -1) {
            return true
        }
        return false
    }

    /**
     * isLoggedIn
     */
    public isAdminLoggedIn(): boolean {
        if (this.user && ["Super Administrador", "Administrador"].indexOf(this.user.role) > -1) {
            return true
        }
        return false
    }

    /**
     * logOut
     */
    public async logOut() {
        this.user = null
        sessionStorage.removeItem("oilgroupAccessToken")
        sessionStorage.removeItem("oilgroup-buy")
        sessionStorage.removeItem("oilgroup-sale")
        this.Router.navigateByUrl('login');
    }

    /**
     * getUser
     */
    public getUser(): any {
        return this.user
    }

    /**
     * getAll
     */
    public async getAll(data) {
        return new Promise((resolve, reject) => {
            this.api.post("user/getAll/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * find
     */
    public async find(data) {
        return new Promise((resolve, reject) => {
            this.api.post("user/find/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * create
     */
    public async create(data) {
        return new Promise((resolve, reject) => {
            this.api.post("user/create/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * update
     */
    public async update(data) {
        return new Promise((resolve, reject) => {
            this.api.post("user/update/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * reset
     */
    public async reset(data) {
        return new Promise((resolve, reject) => {
            this.api.post("user/reset/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * active
     */
    public async active(data) {
        return new Promise((resolve, reject) => {
            this.api.post("user/active/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * summary
     */
    public async summary(data) {
        return this.api.download("user/summary/", data).subscribe(data => {
            this.progress.emit(data)
        }, error => {
            this.progress.emit(error)
        })
    }

    /**
     * pending
     */
    public async pending(data) {
        return this.api.download("user/pending/", data).subscribe(data => {
            this.progress.emit(data)
        }, error => {
            this.progress.emit(error)
        })
    }
}

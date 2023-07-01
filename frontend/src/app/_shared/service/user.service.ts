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

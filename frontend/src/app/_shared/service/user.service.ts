import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';

import { lastValueFrom } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class UserService {

    progress = new EventEmitter<any>()

    public user: any = null

    constructor(
        private Router: Router,
        private api: ApiService,
    ) { }

    /**
     * getAll
     */
    public async getAll(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("user/getAll/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * find
     */
    public async find(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("user/find/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * create
     */
    public async create(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("user/create/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * update
     */
    public async update(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("user/update/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * reset
     */
    public async reset(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("user/reset/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * active
     */
    public async active(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("user/active/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * summary
     */
    public async summary(data: any) {
        return this.api.download("user/summary/", data).subscribe(data => {
            this.progress.emit(data)
        }, error => {
            this.progress.emit(error)
        })
    }

    /**
     * pending
     */
    public async pending(data: any) {
        return this.api.download("user/pending/", data).subscribe(data => {
            this.progress.emit(data)
        }, error => {
            this.progress.emit(error)
        })
    }
}

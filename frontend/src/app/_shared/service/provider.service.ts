import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
    providedIn: 'root'
})
export class ProviderService {

    constructor(
        private api: ApiService,
    ) { }

    /**
     * getAll
     */
    public async getAll(data: any) {
        return new Promise((resolve, reject) => {
            this.api.post("provider/getAll/", data).toPromise().then((data: any) => {
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
            this.api.post("provider/find/", data).toPromise().then((data: any) => {
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
            this.api.post("provider/create/", data).toPromise().then((data: any) => {
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
            this.api.post("provider/update/", data).toPromise().then((data: any) => {
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
            this.api.post("provider/active/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}

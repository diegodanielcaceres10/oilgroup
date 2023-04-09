import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
    providedIn: 'root'
})
export class BuyService {

    constructor(
        private api: ApiService,
    ) { }

    /**
     * find
     */
    public async find(data) {
        return new Promise((resolve, reject) => {
            this.api.post("buy/find/", data).toPromise().then((data: any) => {
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
            this.api.post("buy/create/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * billing
     */
    public async billing(data) {
        return new Promise((resolve, reject) => {
            this.api.post("buy/billing/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * cancel
     */
    public async cancel(data) {
        return new Promise((resolve, reject) => {
            this.api.post("buy/cancel/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}

import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

import { lastValueFrom } from 'rxjs';
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
    public async find(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("buy/find/", data)).then((data: any) => {
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
            lastValueFrom(this.api.post("buy/create/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * billing
     */
    public async billing(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("buy/billing/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * cancel
     */
    public async cancel(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("buy/cancel/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}

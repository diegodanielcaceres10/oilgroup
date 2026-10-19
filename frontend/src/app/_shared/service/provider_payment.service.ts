import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

import { lastValueFrom } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class ProviderPaymentService {

    constructor(
        private api: ApiService,
    ) { }

    /**
     * find
     */
    public async find(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("provider_payment/find/", data)).then((data: any) => {
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
            lastValueFrom(this.api.post("provider_payment/create/", data)).then((data: any) => {
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
            lastValueFrom(this.api.post("provider_payment/cancel/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}

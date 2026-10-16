import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
    providedIn: 'root'
})
export class CustomerPaymentService {

    constructor(
        private api: ApiService,
    ) { }

    /**
     * find
     */
    public async find(data: any) {
        return new Promise((resolve, reject) => {
            this.api.post("customer_payment/find/", data).toPromise().then((data: any) => {
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
            this.api.post("customer_payment/create/", data).toPromise().then((data: any) => {
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
            this.api.post("customer_payment/cancel/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}

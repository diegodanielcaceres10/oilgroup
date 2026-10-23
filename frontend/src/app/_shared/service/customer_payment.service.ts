import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ApiResponse } from '../models/api';
import { CustomerPaymentDetail, CustomerPaymentWrite } from '../models/customer_payment';

import { lastValueFrom } from 'rxjs';
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
    public async find(data: { payment: { id: number } }): Promise<ApiResponse<CustomerPaymentDetail>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<CustomerPaymentDetail>>("customer_payment/find/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * create
     */
    public async create(data: { payment: CustomerPaymentWrite }): Promise<ApiResponse<number>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<number>>("customer_payment/create/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * cancel
     */
    public async cancel(data: { payment: { id: number } }): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse>("customer_payment/cancel/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}

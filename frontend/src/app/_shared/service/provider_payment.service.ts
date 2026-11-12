import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ApiResponse } from '../models/api';
import { ProviderPaymentDetail, ProviderPaymentWrite } from '../models/provider_payment';

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
    public async find(data: { payment: { id: number } }): Promise<ApiResponse<ProviderPaymentDetail>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<ProviderPaymentDetail>>("provider_payment/find/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * create
     */
    public async create(data: { payment: ProviderPaymentWrite }): Promise<ApiResponse<number>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<number>>("provider_payment/create/", data)).then((data) => {
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
            lastValueFrom(this.api.post<ApiResponse>("provider_payment/cancel/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}

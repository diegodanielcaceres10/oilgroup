import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ApiResponse } from '../models/api';
import { BuyCreate, BuyDetail } from '../models/buy';

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
    public async find(data: { buy: { id: number } }): Promise<ApiResponse<BuyDetail>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<BuyDetail>>("buy/find/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * create
     */
    public async create(data: { buy: BuyCreate }): Promise<ApiResponse<number>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<number>>("buy/create/", data)).then((data) => {
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
    public async cancel(data: { buy: { id: number } }): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse>("buy/cancel/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}

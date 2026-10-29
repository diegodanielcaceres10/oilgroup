import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ApiResponse } from '../models/api';
import { ApiFilter } from '../models/filter';
import { DollarQuote, LicenseDetail, LicensePaymentApproval, LicensePriceUpdate, LicenseRemoveResponse, LicenseRow, LicenseUpload } from '../models/license';

import { lastValueFrom } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class LicenseService {

    constructor(
        private api: ApiService,
    ) { }

    /**
     * getAll
     */
    public async getAll(data: { filter?: ApiFilter[] }): Promise<ApiResponse<LicenseRow[]>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<LicenseRow[]>>("license/getAll/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * find
     */
    public async find(data: { license: { id: number } }): Promise<ApiResponse<LicenseDetail>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<LicenseDetail>>("license/find/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * price
     */
    public async price(data: { license: LicensePriceUpdate }): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse>("license/price/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * remove
     */
    public async remove(data: { license: { id: number } }): Promise<LicenseRemoveResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<LicenseRemoveResponse>("license/remove/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * upload
     */
    public async upload(data: LicenseUpload): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse>("license/upload/", data, "form-data")).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * payment
     */
    public async payment(data: { payment: LicensePaymentApproval }): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse>("license/payment/", data)).then((data) => {
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
            lastValueFrom(this.api.post<ApiResponse>("license/cancel/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * getDollar
     */
    public async getDollar(): Promise<number | undefined> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.get<DollarQuote>("https://api.bluelytics.com.ar/v2/latest")).then((data) => {
                const dollar = data && data.blue && data.blue.value_sell;
                resolve(dollar);
            }).catch((error) => {
                reject(error);
            })
        })
    }
}

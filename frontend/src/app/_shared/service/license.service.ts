import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

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
    public async getAll(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("license/getAll/", data)).then((data: any) => {
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
            lastValueFrom(this.api.post("license/find/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * price
     */
    public async price(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("license/price/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * remove
     */
    public async remove(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("license/remove/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * upload
     */
    public async upload(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("license/upload/", data, "form-data")).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * payment
     */
    public async payment(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("license/payment/", data)).then((data: any) => {
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
            lastValueFrom(this.api.post("license/cancel/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * getDollar
     */
    public async getDollar() {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.get("https://api.bluelytics.com.ar/v2/latest")).then((data: any) => {
                const dollar = data && data.blue && data.blue.value_sell;
                resolve(dollar);
            }).catch((error) => {
                reject(error);
            })
        })
    }
}

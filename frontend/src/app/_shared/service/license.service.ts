import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

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
    public async getAll(data) {
        return new Promise((resolve, reject) => {
            this.api.post("license/getAll/", data).toPromise().then((data: any) => {
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
            this.api.get("https://api.bluelytics.com.ar/v2/latest").toPromise().then((data: any) => {
                const dollar = data && data.blue && data.blue.value_sell;
                resolve(dollar);
            }).catch((error) => {
                reject(error);
            })
        })
    }

    /**
     * price
     */
    public async price(data) {
        return new Promise((resolve, reject) => {
            this.api.post("license/price/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * upload
     */
    public async upload(data) {
        return new Promise((resolve, reject) => {
            this.api.post("license/upload/", data, "form-data").toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}

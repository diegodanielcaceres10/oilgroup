import { Injectable, EventEmitter } from '@angular/core';
import { ApiService } from '../api/api.service';

import { lastValueFrom } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class SaleService {

    progress = new EventEmitter<any>()

    constructor(
        private api: ApiService,
    ) { }

    /**
     * getAll
     */
    public async getAll(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("sale/getAll/", data)).then((data: any) => {
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
            lastValueFrom(this.api.post("sale/find/", data)).then((data: any) => {
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
            lastValueFrom(this.api.post("sale/create/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * review
     */
    public async review(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("sale/review/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * deliver
     */
    public async deliver(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("sale/deliver/", data)).then((data: any) => {
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
            lastValueFrom(this.api.post("sale/billing/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * ticket
     */
    public async ticket(data: any) {
        return this.api.download("sale/ticket/", data).subscribe({
            next: data => {
                this.progress.emit(data)
            },
            error: error => {
                this.progress.emit(error)
            }
        })
    }

    /**
     * cancel
     */
    public async cancel(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("sale/cancel/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}

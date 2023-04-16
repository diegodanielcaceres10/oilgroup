import { Injectable, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
    providedIn: 'root'
})
export class SaleService {

    @Output() progress: EventEmitter<any> = new EventEmitter()

    constructor(
        private api: ApiService,
    ) { }

    /**
     * getAll
     */
    public async getAll(data) {
        return new Promise((resolve, reject) => {
            this.api.post("sale/getAll/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * find
     */
    public async find(data) {
        return new Promise((resolve, reject) => {
            this.api.post("sale/find/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * create
     */
    public async create(data) {
        return new Promise((resolve, reject) => {
            this.api.post("sale/create/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * review
     */
    public async review(data) {
        return new Promise((resolve, reject) => {
            this.api.post("sale/review/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * deliver
     */
    public async deliver(data) {
        return new Promise((resolve, reject) => {
            this.api.post("sale/deliver/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * billing
     */
    public async billing(data) {
        return new Promise((resolve, reject) => {
            this.api.post("sale/billing/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * ticket
     */
    public async ticket(data) {
        return this.api.download("sale/ticket/", data).subscribe(data => {
            this.progress.emit(data)
        }, error => {
            this.progress.emit(error)
        })
    }

    /**
     * cancel
     */
    public async cancel(data) {
        return new Promise((resolve, reject) => {
            this.api.post("sale/cancel/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}

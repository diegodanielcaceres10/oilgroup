import { Injectable, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api/api.service';

import { lastValueFrom } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class ReportService {

    @Output() progressPayments = new EventEmitter<any>()
    @Output() progressActivities = new EventEmitter<any>()

    constructor(
        private api: ApiService,
    ) { }

    /**
     * getPayments
     */
    public async getPayments(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("report/getPayments/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * getActivity
     */
    public async getActivity(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("report/getActivity/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * getArticle
     */
    public async getArticle() {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("report/getArticle/")).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * getBrand
     */
    public async getBrand() {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("report/getBrand/")).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * getCategory
     */
    public async getCategory() {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("report/getCategory/")).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * getCustomer
     */
    public async getCustomer() {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("report/getCustomer/")).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * getProvider
     */
    public async getProvider() {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("report/getProvider/")).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * exportPayments
     */
    public async exportPayments(data: any) {
        return this.api.download("report/exportPayments/", data).subscribe(data => {
            this.progressPayments.emit(data)
        }, error => {
            this.progressPayments.emit(error)
        })
    }

    /**
     * exportActivities
     */
    public async exportActivities(data: any) {
        return this.api.download("report/exportActivities/", data).subscribe(data => {
            this.progressActivities.emit(data)
        }, error => {
            this.progressActivities.emit(error)
        })
    }
}

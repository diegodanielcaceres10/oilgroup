import { Injectable, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api/api.service';

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
            this.api.post("report/getPayments/", data).toPromise().then((data: any) => {
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
            this.api.post("report/getActivity/", data).toPromise().then((data: any) => {
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
            this.api.post("report/getArticle/").toPromise().then((data: any) => {
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
            this.api.post("report/getBrand/").toPromise().then((data: any) => {
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
            this.api.post("report/getCategory/").toPromise().then((data: any) => {
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
            this.api.post("report/getCustomer/").toPromise().then((data: any) => {
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
            this.api.post("report/getProvider/").toPromise().then((data: any) => {
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

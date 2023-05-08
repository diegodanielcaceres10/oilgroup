import { Injectable, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    @Output() progressPrices: EventEmitter<any> = new EventEmitter()
    @Output() progressStock: EventEmitter<any> = new EventEmitter()
    @Output() progressSales: EventEmitter<any> = new EventEmitter()

    constructor(
        private api: ApiService,
    ) { }

    /**
     * getAll
     */
    public async getAll(data) {
        return new Promise((resolve, reject) => {
            this.api.post("article/getAll/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * getPrices
     */
    public async getPrices() {
        return new Promise((resolve, reject) => {
            this.api.post("article/getPrices/").toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * getAllPrices
     */
    public async getAllPrices(data) {
        return new Promise((resolve, reject) => {
            this.api.post("article/getAllPrices/", data).toPromise().then((data: any) => {
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
            this.api.post("article/find/", data).toPromise().then((data: any) => {
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
            this.api.post("article/create/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * update
     */
    public async update(data) {
        return new Promise((resolve, reject) => {
            this.api.post("article/update/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * active
     */
    public async active(data) {
        return new Promise((resolve, reject) => {
            this.api.post("article/active/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * addMeasure
     */
    public async addMeasure(data) {
        return new Promise((resolve, reject) => {
            this.api.post("article/addMeasure/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * updateMeasure
     */
    public async updateMeasure(data) {
        return new Promise((resolve, reject) => {
            this.api.post("article/updateMeasure/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * deleteMeasure
     */
    public async deleteMeasure(data) {
        return new Promise((resolve, reject) => {
            this.api.post("article/deleteMeasure/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * updatePrices
     */
    public async updatePrices(data) {
        return new Promise((resolve, reject) => {
            this.api.post("article/updatePrices/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * updateStock
     */
    public async updateStock(data) {
        return new Promise((resolve, reject) => {
            this.api.post("article/updateStock/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * exportPrices
     */
    public async exportPrices() {
        return this.api.download("article/exportPrices/").subscribe(data => {
            this.progressPrices.emit(data)
        }, error => {
            this.progressPrices.emit(error)
        })
    }

    /**
     * exportStock
     */
    public async exportStock() {
        return this.api.download("article/exportStock/").subscribe(data => {
            this.progressStock.emit(data)
        }, error => {
            this.progressStock.emit(error)
        })
    }

    /**
     * exportSales
     */
    public async exportSales(data) {
        return this.api.download("article/exportSales/", data).subscribe(data => {
            this.progressSales.emit(data)
        }, error => {
            this.progressSales.emit(error)
        })
    }
}

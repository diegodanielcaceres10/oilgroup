import { Injectable, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ApiResponse } from '../models/api';
import { ArticleDetail, ArticleRow, ArticleUpdate, ArticleWrite, MeasureAdd, MeasureDelete, MeasureUpdate, PriceListRow, PriceRow, PriceUpdate, StockAdjustment } from '../models/article';
import { ApiFilter } from '../models/filter';

import { lastValueFrom } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class ArticleService {

    @Output() progressPrices = new EventEmitter<any>()
    @Output() progressStock = new EventEmitter<any>()
    @Output() progressSales = new EventEmitter<any>()

    constructor(
        private api: ApiService,
    ) { }

    /**
     * getAll
     */
    public async getAll(data: { filter?: ApiFilter[] }): Promise<ApiResponse<ArticleRow[]>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<ArticleRow[]>>("article/getAll/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * getPrices
     */
    public async getPrices(): Promise<ApiResponse<PriceListRow[]>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<PriceListRow[]>>("article/getPrices/")).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * getAllPrices
     */
    public async getAllPrices(data: { filter?: ApiFilter[] }): Promise<ApiResponse<PriceRow[]>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<PriceRow[]>>("article/getAllPrices/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * find
     */
    public async find(data: { article: { id: number } }): Promise<ApiResponse<ArticleDetail>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<ArticleDetail>>("article/find/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * create
     */
    public async create(data: { article: ArticleWrite }): Promise<ApiResponse<number>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<number>>("article/create/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * update
     */
    public async update(data: { article: ArticleUpdate }): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse>("article/update/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * active
     */
    public async active(data: { article: { id: number } }): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse>("article/active/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * addMeasure
     */
    public async addMeasure(data: { price: MeasureAdd }): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse>("article/addMeasure/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * updateMeasure
     */
    public async updateMeasure(data: { price: MeasureUpdate }): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse>("article/updateMeasure/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * deleteMeasure
     */
    public async deleteMeasure(data: { price: MeasureDelete }): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse>("article/deleteMeasure/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * updatePrices
     */
    public async updatePrices(data: { price: PriceUpdate }): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse>("article/updatePrices/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * updateStock
     */
    public async updateStock(data: { article: StockAdjustment }): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse>("article/updateStock/", data)).then((data) => {
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
        return this.api.download("article/exportPrices/").subscribe({
            next: data => {
                this.progressPrices.emit(data)
            },
            error: error => {
                this.progressPrices.emit(error)
            }
        })
    }

    /**
     * exportStock
     */
    public async exportStock() {
        return this.api.download("article/exportStock/").subscribe({
            next: data => {
                this.progressStock.emit(data)
            },
            error: error => {
                this.progressStock.emit(error)
            }
        })
    }

    /**
     * exportSales
     */
    public async exportSales(data: { article: { id: number } }) {
        return this.api.download("article/exportSales/", data).subscribe({
            next: data => {
                this.progressSales.emit(data)
            },
            error: error => {
                this.progressSales.emit(error)
            }
        })
    }
}

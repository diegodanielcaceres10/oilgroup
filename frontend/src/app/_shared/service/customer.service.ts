import { Injectable, EventEmitter } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ApiResponse } from '../models/api';
import { CustomerDetail, CustomerRow, CustomerUpdate, CustomerWrite } from '../models/customer';
import { ApiFilter } from '../models/filter';

import { lastValueFrom } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class CustomerService {

    progress = new EventEmitter<any>()

    constructor(
        private api: ApiService,
    ) { }

    /**
     * getAll
     */
    public async getAll(data: { filter?: ApiFilter[] }): Promise<ApiResponse<CustomerRow[]>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<CustomerRow[]>>("customer/getAll/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * find
     */
    public async find(data: { customer: { id: number } }): Promise<ApiResponse<CustomerDetail>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<CustomerDetail>>("customer/find/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * create
     */
    public async create(data: { customer: CustomerWrite }): Promise<ApiResponse<number>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<number>>("customer/create/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * update
     */
    public async update(data: { customer: CustomerUpdate }): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse>("customer/update/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * active
     */
    public async active(data: { customer: { id: number } }): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse>("customer/active/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * summary
     */
    public async summary(data: { customer: { id: number } }) {
        return this.api.download("customer/summary/", data).subscribe({
            next: data => {
                this.progress.emit(data)
            },
            error: error => {
                this.progress.emit(error)
            }
        })
    }
}

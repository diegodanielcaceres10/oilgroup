import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ApiResponse } from '../models/api';
import { ApiFilter } from '../models/filter';
import { ProviderDetail, ProviderRow, ProviderUpdate, ProviderWrite } from '../models/provider';

import { lastValueFrom } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class ProviderService {

    constructor(
        private api: ApiService,
    ) { }

    /**
     * getAll
     */
    public async getAll(data: { filter?: ApiFilter[] }): Promise<ApiResponse<ProviderRow[]>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<ProviderRow[]>>("provider/getAll/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * find
     */
    public async find(data: { provider: { id: number } }): Promise<ApiResponse<ProviderDetail>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<ProviderDetail>>("provider/find/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * create
     */
    public async create(data: { provider: ProviderWrite }): Promise<ApiResponse<number>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<number>>("provider/create/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * update
     */
    public async update(data: { provider: ProviderUpdate }): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse>("provider/update/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * active
     */
    public async active(data: { provider: { id: number } }): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse>("provider/active/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}

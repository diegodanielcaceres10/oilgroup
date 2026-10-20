import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ApiResponse } from '../models/api';
import { Filter } from '../models/filter';
import { Category, CategoryUpdate } from '../models/category';

import { lastValueFrom } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    constructor(
        private api: ApiService,
    ) { }

    /**
     * getAll
     */
    public async getAll(data: { filter?: Filter[] }): Promise<ApiResponse<Category[]>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<Category[]>>("category/getAll/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * update
     */
    public async update(data: { category: CategoryUpdate }): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse>("category/update/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}

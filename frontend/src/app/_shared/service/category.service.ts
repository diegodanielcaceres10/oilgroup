import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

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
    public async getAll(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("category/getAll/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * update
     */
    public async update(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("category/update/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}

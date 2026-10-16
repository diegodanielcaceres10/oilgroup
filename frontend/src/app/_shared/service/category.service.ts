import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

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
            this.api.post("category/getAll/", data).toPromise().then((data: any) => {
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
            this.api.post("category/update/", data).toPromise().then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}

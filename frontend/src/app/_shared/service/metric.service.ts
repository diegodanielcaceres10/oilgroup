import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

import { lastValueFrom } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class MetricService {

    constructor(
        private api: ApiService,
    ) { }

    /**
     * getAll
     */
    public async getAll(data: any) {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("metric/getAll/", data)).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * getAllExtend
     */
    public async getAllExtend() {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post("metric/getAllExtend/")).then((data: any) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}

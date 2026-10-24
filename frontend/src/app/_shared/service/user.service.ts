import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';
import { ApiResponse } from '../models/api';
import { ApiFilter } from '../models/filter';
import { UserDetail, UserKey, UserRow, UserUpdate, UserWrite } from '../models/user';

import { lastValueFrom } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class UserService {

    progress = new EventEmitter<any>()

    public user: UserRow | null = null

    constructor(
        private Router: Router,
        private api: ApiService,
    ) { }

    /**
     * getAll
     */
    public async getAll(data: { filter?: ApiFilter[] }): Promise<ApiResponse<UserRow[]>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<UserRow[]>>("user/getAll/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * find
     */
    public async find(data: { user: UserKey }): Promise<ApiResponse<UserDetail>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<UserDetail>>("user/find/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * create
     */
    public async create(data: { user: UserWrite }): Promise<ApiResponse<string>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<string>>("user/create/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * update
     */
    public async update(data: { user: UserUpdate }): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse>("user/update/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * reset
     */
    public async reset(data: { user: UserKey }): Promise<ApiResponse<string>> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse<string>>("user/reset/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * active
     */
    public async active(data: { user: UserKey }): Promise<ApiResponse> {
        return new Promise((resolve, reject) => {
            lastValueFrom(this.api.post<ApiResponse>("user/active/", data)).then((data) => {
                resolve(data)
            }).catch((error) => {
                reject(error)
            })
        })
    }

    /**
     * summary
     */
    public async summary(data: { user: UserKey }) {
        return this.api.download("user/summary/", data).subscribe({
            next: data => {
                this.progress.emit(data)
            },
            error: error => {
                this.progress.emit(error)
            }
        })
    }

    /**
     * pending
     */
    public async pending(data: { user: UserKey }) {
        return this.api.download("user/pending/", data).subscribe({
            next: data => {
                this.progress.emit(data)
            },
            error: error => {
                this.progress.emit(error)
            }
        })
    }
}

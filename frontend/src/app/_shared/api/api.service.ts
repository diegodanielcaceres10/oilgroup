import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    headers: any;

    /**
     * Base URL for all requests made through this
     * service.
     */
    public apiUrl: string = environment.apiUrl

    /**
     * Creates a new HttpApiService instance and initializes it.
     */
    constructor(
        public httpClient: HttpClient,
    ) { }

    public setToken(token: any, username: any) {
        this.headers = new HttpHeaders({ "Authorization": token, "username": username });
    }

    /**
     *
     * @param url The endpoint URL.
     * @param body The content to replace with.
     *
     * @return An `Observable` of the response, with the response body as a JSON object.
     */
    public get(url: string): Observable<Object> {
        return this.httpClient.get(url);
    }

    /**
     *
     * @param url The endpoint URL.
     * @param body The content to replace with.
     *
     * @return An `Observable` of the response, with the response body as a JSON object.
     */
    public post(path: string, values?: any, raw?: string): Observable<Object> {
        let body: any = {};
        if (raw == "form-data") {
            const formData = new FormData();
            Object.keys(values).forEach(key => {
                if (typeof values[key] == "object" && values[key] && values[key].length !== undefined) {
                    for (let value of values[key]) {
                        formData.append(key, value);
                    }
                } else if (values[key] !== undefined && values[key] !== null) formData.append(key, values[key]);
            });
            body = formData;
        } else {
            body = values;
        }
        return this.httpClient.post(this.apiUrl + path, body, { headers: this.headers })
    }

    /**
     *
     * @param url The endpoint URL.
     * @param body The content to replace with.
     *
     * @return An `Observable` of the response, with the response body as a JSON object.
     */
    public download(path: string, body?: any): Observable<Object> {
        return this.httpClient.post(this.apiUrl + path, body, { responseType: "blob", reportProgress: true, observe: "events", headers: this.headers });
    }
}

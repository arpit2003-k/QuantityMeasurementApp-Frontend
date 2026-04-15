import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { QuantityInputDTO, QuantityMeasurementDTO } from '../models/models';

@Injectable({ providedIn: 'root' })
export class QuantityService {

    private api = `${environment.apiUrl}/quantities`;

    constructor(private http: HttpClient) { }

    compare(input: QuantityInputDTO): Observable<QuantityMeasurementDTO> {
        return this.http.post<QuantityMeasurementDTO>(`${this.api}/compare`, input);
    }

    convert(input: QuantityInputDTO): Observable<QuantityMeasurementDTO> {
        return this.http.post<QuantityMeasurementDTO>(`${this.api}/convert`, input);
    }

    add(input: QuantityInputDTO): Observable<QuantityMeasurementDTO> {
        return this.http.post<QuantityMeasurementDTO>(`${this.api}/add`, input);
    }

    subtract(input: QuantityInputDTO): Observable<QuantityMeasurementDTO> {
        return this.http.post<QuantityMeasurementDTO>(`${this.api}/subtract`, input);
    }

    divide(input: QuantityInputDTO): Observable<QuantityMeasurementDTO> {
        return this.http.post<QuantityMeasurementDTO>(`${this.api}/divide`, input);
    }

    getHistoryByType(type: string): Observable<QuantityMeasurementDTO[]> {
        return this.http.get<QuantityMeasurementDTO[]>(`${this.api}/history/type/${type}`);
    }

    getErrorHistory(): Observable<QuantityMeasurementDTO[]> {
        return this.http.get<QuantityMeasurementDTO[]>(`${this.api}/history/errored`);
    }
}
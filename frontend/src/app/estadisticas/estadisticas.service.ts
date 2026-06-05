import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
    estadisticas = signal<any>(null);

    constructor(private http: HttpClient) { }

    cargar() {
        this.http.get('/api/v1/estadisticas')
            .subscribe(data => this.estadisticas.set(data));
    }
}
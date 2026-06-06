import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ListMetaDTO } from './list-meta-dto';

@Injectable({
  providedIn: 'root',
})

export class MetasListadoApiClient {
  
  private readonly httpClient = inject(HttpClient);
  
  buscarMetasPorProyecto(idProyecto: number): Observable<ListMetaDTO[]> {
    
    return this.httpClient.get<ListMetaDTO[]>(`/api/v1/metas/proyecto/${idProyecto}`);
  }

  exportarCsv(idProyecto: number): Observable<Blob> {
    return this.httpClient.get(`/api/v1/metas/proyecto/${idProyecto}/export/csv`, { responseType: 'blob' }) as Observable<Blob>;
  }
}


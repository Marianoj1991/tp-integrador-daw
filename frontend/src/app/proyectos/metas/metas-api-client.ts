import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class MetasApiClient {
  private readonly httpClient: HttpClient = inject(HttpClient);

  exportarCsv(idProyecto: number | null): Observable<Blob> {
    return this.httpClient.get('/api/v1/metas/proyecto/' + idProyecto + '/export/csv', { responseType: 'blob' }) as Observable<Blob>;
  }
}

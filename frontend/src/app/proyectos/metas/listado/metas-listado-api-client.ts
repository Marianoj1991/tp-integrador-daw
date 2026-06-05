import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ListMetaDTO } from './list-meta-dto';

/*
  @Injectable indica que una clase es un servicio y que puede ser inyectada en otras clases.
  @providedIn: 'root' sirve para disponibilizar este servicio en toda la aplicacion.
*/
@Injectable({
  providedIn: 'root',
})
/*
  Esta clase se encarga de la comunicacion con el backend para obtener las metas de un proyecto.
*/
export class MetasListadoApiClient {
  // Se inyecta el HttpClient para poder hacer peticiones HTTP.
  private readonly httpClient = inject(HttpClient);
  /*
    Este metodo busca las metas de un proyecto
    @param idProyecto - id del proyecto
    @return Observable con la lista de metas
  */
  buscarMetasPorProyecto(idProyecto: number): Observable<ListMetaDTO[]> {
    // Se hace la peticion GET al endpoint /api/v1/metas/proyecto/{idProyecto} para obtener las metas del proyecto
    // Lo que se encuentra entre <> es el tipo de dato que se espera recibir.
    // Entre parentesis se pasa el endpoint interpolando el idProyecto.
    return this.httpClient.get<ListMetaDTO[]>(`/api/v1/metas/proyecto/${idProyecto}`);
  }

}


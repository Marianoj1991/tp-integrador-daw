import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateMetaDTO } from "./create-meta-dto";
import { UpdateMetaDTO } from "./update-meta-dto";

@Injectable({
    providedIn: "root"
})

export class GestionMetaApiClient {
    private readonly httpClient: HttpClient = inject(HttpClient);

    /*
        Este metodo crea una meta
        @param meta - payload
        @return Observable con el id de la meta creada
    */
    crearMeta(meta: CreateMetaDTO): Observable<{ id: number }> {
        // Se hace la peticion POST al endpoint /api/v1/metas para crear una meta
        // Entre parentesis se pasa el endpoint y se le pasa el dto de create como cuerpo.
        return this.httpClient.post<{ id: number }>("/api/v1/metas", meta);
    }

    /*
        Este metodo actualiza una meta
        @param id 
        @param meta - payload
        @return Observable con void
    */

    actualizarMeta(id: number, meta: UpdateMetaDTO): Observable<void> {
        // Se hace la peticion PUT al endpoint /api/v1/metas/id para actualizar una meta
        // Entre parentesis se pasa el endpoint y se le pasa el dto de update como cuerpo.
        return this.httpClient.put<void>("/api/v1/metas/" + id, meta);
    }
}

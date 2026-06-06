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

    
    crearMeta(meta: CreateMetaDTO): Observable<{ id: number }> {
        
        
        return this.httpClient.post<{ id: number }>("/api/v1/metas", meta);
    }

    actualizarMeta(id: number, meta: UpdateMetaDTO): Observable<void> {
        
        
        return this.httpClient.put<void>("/api/v1/metas/" + id, meta);
    }
}

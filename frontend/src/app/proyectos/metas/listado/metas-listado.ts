import { Component, computed, effect, inject, input, InputSignal, model, ModelSignal, OnInit, signal, WritableSignal } from "@angular/core";
import { MessageService } from "primeng/api";
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from "primeng/dialog";
import { MetasListadoApiClient } from "./metas-listado-api-client";
import { ListMetaDTO } from "./list-meta-dto";
import { GestionMeta } from "../gestion/gestion-meta";

@Component({
  selector: "app-metas-listado",
  templateUrl: "./metas-listado.html",
  styleUrls: ["./metas-listado.css"],
  imports: [TableModule, ButtonModule, DialogModule, TooltipModule, GestionMeta]
})

export class MetasListado {
  private readonly messageService: MessageService = inject(MessageService);
  
  visible: ModelSignal<boolean> = model(false);

  idProyecto: InputSignal<number | null> = input<number | null>(null);

  proyectoEstado: InputSignal<string | null> = input<string | null>(null);

  private readonly metasListadoApiClient: MetasListadoApiClient = inject(MetasListadoApiClient);

  metas: WritableSignal<ListMetaDTO[]> = signal([]);

  dialogVisible: WritableSignal<boolean> = signal(false);

  metaSeleccionada: WritableSignal<ListMetaDTO | null> = signal<ListMetaDTO | null>(null);

  constructor() {
    
    effect(() => {
      if (!this.dialogVisible()) {
        this.refrescarMetas();
      }
    });

    effect(() => {
      if (this.visible()) {
        this.refrescarMetas();
      }
    });
  }

  refrescarMetas(): void {
    const id = this.idProyecto();
    if (!id) return;

    this.metasListadoApiClient.buscarMetasPorProyecto(id).subscribe({
      next: (data) => {
        this.metas.set(data);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener las metas' });
      }
    });
  }

  crearMeta(): void {
    this.dialogVisible.set(true);
  }

  editarMeta(meta: ListMetaDTO): void {
    this.dialogVisible.set(true);
    this.metaSeleccionada.set(meta);
  }

}

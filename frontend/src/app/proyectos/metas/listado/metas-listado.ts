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
// Componente para listar las metas de un proyecto
export class MetasListado {
  private readonly messageService: MessageService = inject(MessageService);
  
  // Controla la visibilidad del diálogo de metas
  visible: ModelSignal<boolean> = model(false);

  // Recibe el ID del proyecto
  idProyecto: InputSignal<number | null> = input<number | null>(null);

  // Recibe el estado del proyecto
  proyectoEstado: InputSignal<string | null> = input<string | null>(null);

  private readonly metasListadoApiClient: MetasListadoApiClient = inject(MetasListadoApiClient);

  // Lista de metas
  metas: WritableSignal<ListMetaDTO[]> = signal([]);


  // Controla la visibilidad del diálogo de creación/edición de metas
  dialogVisible: WritableSignal<boolean> = signal(false);

  // Meta seleccionada para edición
  metaSeleccionada: WritableSignal<ListMetaDTO | null> = signal<ListMetaDTO | null>(null);

  constructor() {
    // Recarga las metas cuando cambia el estado del diálogo de edición a oculto
    effect(() => {
      if (!this.dialogVisible()) {
        this.refrescarMetas();
      }
    });

    // Carga las metas al abrir el modal principal de listado
    effect(() => {
      if (this.visible()) {
        this.refrescarMetas();
      }
    });
  }

  // Refresca la lista de metas desde el backend
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

  // Abre el diálogo para crear una meta
  crearMeta(): void {
    this.dialogVisible.set(true);
  }

  // Abre el diálogo para editar una meta
  editarMeta(meta: ListMetaDTO): void {
    this.dialogVisible.set(true);
    this.metaSeleccionada.set(meta);
  }


}

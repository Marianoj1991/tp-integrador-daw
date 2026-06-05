import { Component, effect, inject, input, InputSignal, model, ModelSignal,  signal, WritableSignal } from "@angular/core";
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
/* 
  Componente que se encarga de listar las metas de un proyecto.
*/
export class MetasListado {
  /*
   Se inyecta el servicio MessageService para mostrar mensajes al usuario.
  */
  private readonly messageService: MessageService = inject(MessageService);
  /*
    Signal que controla la visibilidad del dialog.
  */
  visible: ModelSignal<boolean> = model(false);
  /*
    Input signal que recibe el id del proyecto.
  */
  idProyecto: InputSignal<number | null> = input<number | null>(null);
  /*
    Input signal que recibe el estado del proyecto.
  */
  proyectoEstado: InputSignal<string | null> = input<string | null>(null);
  /*
    Se inyecta el ApiClient para realizar las consultas de las metas de un proyecto.
  */
  private readonly metasListadoApiClient: MetasListadoApiClient = inject(MetasListadoApiClient);
  /*
    Array de metas.
  */
  metas: WritableSignal<ListMetaDTO[]> = signal([]);
  /*
    Signal que controla la visibilidad del dialog.
  */
  dialogCrearMetaVisible: WritableSignal<boolean> = signal(false);
  /*
    Signal que almacena la meta seleccionada.
  */
  metaSeleccionada: WritableSignal<ListMetaDTO | null> = signal<ListMetaDTO | null>(null);

  constructor() {
    
    /*
      Efecto reactivo: refresca la lista de metas solo cuando el modal principal está visible 
      y el subdialog de gestión se cierra. Evita peticiones innecesarias al servidor al inicializar.
    */
    effect(() => {
      if (this.visible() && !this.dialogCrearMetaVisible()) {
        /*
          Se invoca el metodo refrescarMetas() para obtener las metas del proyecto.
        */
        this.refrescarMetas();
      }
    });

  }
  /*
    Metodo que se encarga de refrescar la lista de metas del proyecto.
  */
  refrescarMetas(): void {
    // Se asigna el id del proyecto a la variable id.
    const id = this.idProyecto();
    // Se verifica si el id es null, si es null se retorna.
    if (!id) return;
    // Se realiza la peticion GET al endpoint /api/v1/metas/proyecto/{idProyecto} para obtener las metas del proyecto y se subscribe ya que
    // esta retornando un observable.
    this.metasListadoApiClient.buscarMetasPorProyecto(id).subscribe({
      // Si la peticion es exitosa se actualiza el array de metas
      next: (data) => {
        this.metas.set(data);
      },
      // Si la peticion falla se muestra un mensaje de error
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener las metas' });
      }
    });
  }
  /*
    Metodo que se encarga de crear una meta.
  */
  crearMeta(): void {
    // Setea en verdadero que el modal de crear meta esta visible
    this.dialogCrearMetaVisible.set(true);
  }
  /*
    Metodo que se encarga de editar una meta.
  */
  editarMeta(meta: ListMetaDTO): void {
    // Setea en verdadero que el modal de crear meta esta visible
    this.dialogCrearMetaVisible.set(true);
    // Setea la meta seleccionada para editarla
    this.metaSeleccionada.set(meta);
  }

  /*
    Metodo que se encarga de exportar las metas del proyecto a un archivo CSV.
  */
  exportarCsv(): void {
    const id = this.idProyecto();
    if (!id) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'No hay proyecto seleccionado' });
      return;
    }

    this.metasListadoApiClient.exportarCsv(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob as Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `metas-${id}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al exportar CSV' });
      }
    });
  }
}

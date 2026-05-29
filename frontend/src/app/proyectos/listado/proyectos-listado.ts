import { Component, effect, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ListProyectoDTO } from './list-proyecto-dto';
import { ProyectosListadoApiClient } from './proyectos-listado-api-client';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Template } from '../../template/template';
import { TooltipModule } from 'primeng/tooltip';
import { GestionProyecto } from '../gestion/gestion-proyecto';
import { EstadisticasComponent } from '../../estadisticas/estadisticas';
import { MetasDialog } from '../metas/metas-dialog';

@Component({
  selector: 'app-proyectos-listado',
  templateUrl: './proyectos-listado.html',
  styleUrls: ['./proyectos-listado.css'],
  imports: [TableModule, ButtonModule, Template, TooltipModule, GestionProyecto, EstadisticasComponent, MetasDialog],
})
export class ProyectosListado implements OnInit {
  private readonly messageService: MessageService = inject(MessageService);

  private readonly proyectosListadoApiClient: ProyectosListadoApiClient =
    inject(ProyectosListadoApiClient);
  private readonly proyectosListadoApiClient2: ProyectosListadoApiClient =
    inject(ProyectosListadoApiClient);

  proyectos: WritableSignal<ListProyectoDTO[]> = signal([]);

  dialogVisible: WritableSignal<boolean> = signal(false);

  estadisticasVisible: WritableSignal<boolean> = signal(false)

  proyectoSeleccionado: WritableSignal<ListProyectoDTO | null> = signal<ListProyectoDTO | null>(
    null,
  );

  constructor() {
    effect(() => {
      if (!this.dialogVisible()) {
        this.refrescarProyectos();
      }
    });
  }

  ngOnInit(): void {
    this.refrescarProyectos();
  }

  refrescarProyectos(): void {
    this.proyectosListadoApiClient.buscarProyectos().subscribe({
      next: (data) => {
        this.proyectos.set(data);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener los proyectos',
        });
      },
    });
  }

  crearProyecto(): void {
    this.dialogVisible.set(true);
  }

  abrirEstadisticas(): void{
    this.estadisticasVisible.set(true);
  }

  editarProyecto(proyecto: ListProyectoDTO): void {
    this.dialogVisible.set(true);
    this.proyectoSeleccionado.set(proyecto);
  }

  gestionarTareas(proyecto: ListProyectoDTO): void {
    window.open(`/proyectos/${proyecto.id}/tareas`, '_blank');
  }

  exportarCsv(): void {
    this.proyectosListadoApiClient2.exportarCsv().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob as Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `proyectos.csv`;
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

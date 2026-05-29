import { Component, inject, model, ModelSignal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MetasApiClient } from './metas-api-client';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-metas-dialog',
  templateUrl: './metas-dialog.html',
  styleUrls: ['./metas-dialog.css'],
  standalone: true,
  imports: [DialogModule, ButtonModule],
})
export class MetasDialog {
  visible: ModelSignal<boolean> = model(false);

  idProyecto: number | null = null; // asignar desde el componente padre si es necesario

  private readonly metasApiClient: MetasApiClient = inject(MetasApiClient);
  private readonly messageService: MessageService = inject(MessageService);

  exportarCsv(): void {
    if (!this.idProyecto) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'No hay proyecto seleccionado' });
      return;
    }

    this.metasApiClient.exportarCsv(this.idProyecto).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob as Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `metas-${this.idProyecto}.csv`;
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

  open(idProyecto: number): void {
    this.idProyecto = idProyecto;
    this.visible.set(true);
  }
}

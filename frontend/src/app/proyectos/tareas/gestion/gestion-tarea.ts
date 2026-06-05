import { Component, computed, effect, inject, input, InputSignal, model, ModelSignal, Signal, signal, WritableSignal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MessageService } from "primeng/api";
import { GestionTareaApiClient } from "./gestion-tarea-api-client";
import { ButtonModule } from "primeng/button";
import { ListTareaDTO } from "../listado/list-tarea-dto";
import { EstadosTareasEnum } from "../estados-tareas-enum";
import { UpdateTareaDto } from "./update-tarea-dto";
import { CreateTareaDTO } from "./create-tarea-dto";

@Component({
    selector: "app-gestion-tarea",
    templateUrl: "./gestion-tarea.html",
    styleUrls: ["./gestion-tarea.css"],
    imports: [DialogModule, InputTextModule, SelectModule, ButtonModule, ReactiveFormsModule]
})
export class GestionTarea {
    
    visible: ModelSignal<boolean> = model(false);

    tareaSeleccionada: ModelSignal<ListTareaDTO | null> = model<ListTareaDTO | null>(null);

    readonly estados: WritableSignal<string[]> = signal(Object.values(EstadosTareasEnum));

    private readonly messageService: MessageService = inject(MessageService);

    private readonly gestionTareaApiClient = inject(GestionTareaApiClient);

    readonly idProyecto: InputSignal<number | null> = input<number | null>(null);

    readonly metas: InputSignal<{ id: number; nombre: string; estado: string }[] | null> = input<{ id: number; nombre: string; estado: string }[] | null>(null);

    readonly metasFiltradas: Signal<{ id: number; nombre: string; estado: string }[]> = computed(() => {
        const listadoMetas = this.metas() || [];
        if (this.tareaSeleccionada()) {
            return listadoMetas;
        }
        return listadoMetas.filter(m => m.estado === 'ACTIVO');
    });

    header: Signal<string> = computed(() => {
        if (this.tareaSeleccionada()) {
            return "Editar tarea";
        }
        return "Crear tarea";
    });

    readonly form: FormGroup = new FormGroup({
        descripcion: new FormControl("", [Validators.required]),
        estado: new FormControl(null),
        idMeta: new FormControl(null, [Validators.required])
    });

    constructor() {
        effect(() => {
            if (this.tareaSeleccionada()) {
                this.form.patchValue({
                    descripcion: this.tareaSeleccionada()?.descripcion,
                    estado: this.tareaSeleccionada()?.estado,
                    idMeta: this.tareaSeleccionada()?.idMeta
                });
                this.form.get('idMeta')?.disable();
            }
            else {
                this.form.reset({
                    descripcion: "",
                    estado: null,
                    idMeta: null
                });
                this.form.get('idMeta')?.enable();
            }
        });
    }

    cerrarDialog(): void {
        this.tareaSeleccionada.set(null);
        this.form.reset({
            descripcion: "",
            estado: null
        });
        this.visible.set(false);
    }

    guardarTarea(): void {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos requeridos.' });
            return;
        }

        const formRawValue = this.form.getRawValue();

        if (this.tareaSeleccionada()) {
            const dto: UpdateTareaDto = {
                descripcion: formRawValue.descripcion,
                estado: formRawValue.estado
            };
            this.gestionTareaApiClient.actualizarTarea(this.idProyecto(), this.tareaSeleccionada()?.id!, dto).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tarea actualizada correctamente.' });
                    this.cerrarDialog();
                },
                error: (err) => {
                    let detail: string = "";
                    if (err.error.statusCode >= 400 && err.error.statusCode < 500) {
                        detail = err.error.message
                    }
                    else {
                        detail = "Ha ocurrido un error al actualizar la tarea"
                    }
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: detail });
                }
            });
        } else {
            const dto: CreateTareaDTO = {
                descripcion: formRawValue.descripcion,
                idMeta: formRawValue.idMeta
            };
            this.gestionTareaApiClient.crearTarea(this.idProyecto(), dto).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tarea creada correctamente.' });
                    this.cerrarDialog();
                },
                error: (err) => {
                    let detail: string = "";
                    if (err.error.statusCode >= 400 && err.error.statusCode < 500) {
                        detail = err.error.message
                    }
                    else {
                        detail = "Ha ocurrido un error al crear la tarea"
                    }
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: detail });
                }
            });
        }
    }

}
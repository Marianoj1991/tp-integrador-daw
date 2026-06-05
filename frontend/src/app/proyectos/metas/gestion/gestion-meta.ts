import { Component, computed, effect, inject, input, InputSignal, model, ModelSignal, Signal, signal, WritableSignal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ListMetaDTO } from "../listado/list-meta-dto";
import { EstadosMetasEnum } from "../estados-metas-enum";
import { CreateMetaDTO } from "./create-meta-dto";
import { UpdateMetaDTO } from "./update-meta-dto";
import { GestionMetaApiClient } from "./gestion-meta-api-client";

@Component({ 
    selector: "app-gestion-meta", 
    templateUrl: "./gestion-meta.html", 
    styleUrls: ["./gestion-meta.css"], 
    imports: [DialogModule, InputTextModule, SelectModule, ButtonModule, ReactiveFormsModule] 
    
    
    
    
    
    
})

export class GestionMeta {
    
    visible: ModelSignal<boolean> = model(false);
    
    metaSeleccionada: ModelSignal<ListMetaDTO | null> = model<ListMetaDTO | null>(null);
    
    idProyecto: InputSignal<number | null> = input<number | null>(null);

    
    estados: WritableSignal<string[]> = signal(Object.values(EstadosMetasEnum));

    
    private readonly messageService: MessageService = inject(MessageService);
    
    private readonly gestionMetaApiClient: GestionMetaApiClient = inject(GestionMetaApiClient);

    
    header: Signal<string> = computed(() => {
        if (this.metaSeleccionada()) {
            return "Editar meta"; 
        }
        return "Crear meta";
    });
    
    readonly form: FormGroup = new FormGroup({
        
        nombre: new FormControl("", [Validators.required]), 
        estado: new FormControl(null)
    });

    
    constructor() {
        
        effect(() => {
            
            if (this.metaSeleccionada()) {
                
                this.form.patchValue({
                    nombre: this.metaSeleccionada()?.nombre,
                    estado: this.metaSeleccionada()?.estado
                });
            
            } else {
                
                this.form.reset({
                    nombre: "",
                    estado: null
                });
            }
        });
    }

    
    cerrarDialog(): void {
        
        this.metaSeleccionada.set(null);
        
        this.form.reset({
            nombre: "",
            estado: null
        });
        
        this.visible.set(false);
    }
    
    
    guardarMeta(): void {
        
        if (!this.form.valid) {
            
            this.form.markAllAsTouched();
            
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos requeridos.' });
            return;
        }
        
        const formRawValue = this.form.getRawValue();
        
        if (this.metaSeleccionada()) {
            
            const dto: UpdateMetaDTO = {
                nombre: formRawValue.nombre,
                estado: formRawValue.estado
            };
            
            this.gestionMetaApiClient.actualizarMeta(this.metaSeleccionada()?.id!, dto).subscribe({
                
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Meta actualizada correctamente.' });
                    this.cerrarDialog();
                },
                
                error: (err) => {
                    let detail: string = "";
                    
                    if (err.error?.statusCode >= 400 && err.error?.statusCode < 500) {
                        detail = err.error.message;
                    } else {
                        detail = "Ha ocurrido un error al actualizar la meta";
                    }
                    
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: detail });
                }
            });
        
        } else {
            
            const idProyecto = this.idProyecto();
            
            if (!idProyecto) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se ha proporcionado el ID del proyecto.' });
                return;
            }
            
            const dto: CreateMetaDTO = {
                nombre: formRawValue.nombre,
                idProyecto: idProyecto
            };
            
            this.gestionMetaApiClient.crearMeta(dto).subscribe({
                next: () => {
                    
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Meta creada correctamente.' });
                    
                    this.cerrarDialog();
                },
                
                error: (err) => {
                    let detail: string = "";
                    
                    if (err.error?.statusCode >= 400 && err.error?.statusCode < 500) {
                        detail = err.error.message;
                    } else {
                        detail = "Ha ocurrido un error al crear la meta";
                    }
                    
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: detail });
                }
            });
        }
    }
}

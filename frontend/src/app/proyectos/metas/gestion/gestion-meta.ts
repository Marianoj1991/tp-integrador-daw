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
/*
    Se define esta clase como @component para poder usarla en otros componentes.
*/
@Component({ 
    selector: "app-gestion-meta", //Define el tag HTML que se usara para insertar este componente en otro.
    templateUrl: "./gestion-meta.html", //Define el template HTML del componente.
    styleUrls: ["./gestion-meta.css"], //Define los estilos CSS del componente.
    imports: [DialogModule, InputTextModule, SelectModule, ButtonModule, ReactiveFormsModule] 
    //Define los modulos que se van a usar en este componente:
    // - DialogModule -> //Permite mostrar y ocultar dialogos.
    // - InputTextModule -> //Permite usar inputs de texto.
    // - SelectModule -> //Permite usar selects.
    // - ButtonModule -> //Permite usar botones.
    // - ReactiveFormsModule -> //Permite usar formularios reactivos.
})
/*
    Componente que se encarga de crear y editar metas.
*/
export class GestionMeta {
    /*
        Define la visibilidad del dialogo. Al ser un ModelSignal, cualquier cambio en esta señal se reflejará automaticamente en el template.
        model es una funcion que crea una señal bidireccional.

    */
    visible: ModelSignal<boolean> = model(false);
    /*
        Define la meta seleccionada. 
        Cuando se quiere editar una meta, se asigna la meta seleccionada a esta señal.
        Cuando se quiere crear una meta, se asigna null a esta señal.
        Es una señal bidireccional.
    */
    metaSeleccionada: ModelSignal<ListMetaDTO | null> = model<ListMetaDTO | null>(null);
    /*
        Define el ID del proyecto al que pertenece la meta.
        Es una señal que se pasa como input desde el componente padre (ListadoProyectos) al momento de crear o editar una meta.
    */
    idProyecto: InputSignal<number | null> = input<number | null>(null);

    /*
        Define los estados de las metas.
        Es una señal que se usa para obtener los valores del enum EstadosMetasEnum
    */
    estados: WritableSignal<string[]> = signal(Object.values(EstadosMetasEnum));

    /*
        Define el messageService para mostrar mensajes.
    */
    private readonly messageService: MessageService = inject(MessageService);
    /*
        Define el gestionMetaApiClient para llamar a los metodos del backend.
    */
    private readonly gestionMetaApiClient: GestionMetaApiClient = inject(GestionMetaApiClient);

    /*
        Define el header del dialogo.
        Es una señal computed que depende de la meta seleccionada.
        computed() recibe como parametro una funcion que retorna el valor de la señal.
        
    */
    header: Signal<string> = computed(() => {
        if (this.metaSeleccionada()) {
            return "Editar meta"; // Si hay una meta seleccionada, se muestra "Editar meta" en el header. De lo contrario, se muestra "Crear meta".
        }
        return "Crear meta";
    });
    /*
        Define el formulario.
        Es un FormGroup que contiene los controles del formulario.
    */
    readonly form: FormGroup = new FormGroup({
        /*  
        El formulario esta compuesto por dos controles:
        - nombre: un FormControl que recibe una cadena de texto vacia por defecto y tiene un validador que requiere que el campo no este vacio.
        - estado: un FormControl que recibe null por defecto y no tiene validadores.
        */
        nombre: new FormControl("", [Validators.required]), 
        estado: new FormControl(null)
    });

    /*
        Constructor del componente.
    */
    constructor() {
        /*
            Se define un effect que se ejecuta cada vez que la señal metaSeleccionada cambia.
        */
        effect(() => {
            /*
                Si la señal metaSeleccionada() es distinta de null, osea que se esta editando una meta.
            */
            if (this.metaSeleccionada()) {
                /*
                    Asigna los valores de la meta seleccionada a los controles del formulario.
                */
                this.form.patchValue({
                    nombre: this.metaSeleccionada()?.nombre,
                    estado: this.metaSeleccionada()?.estado
                });
            /*
                Caso contrario, es decir, si la señal metaSeleccionada() es null, se resetea el formulario.
            */
            } else {
                /*
                    Resetea el formulario a sus valores iniciales: nombre vacio y estado null.
                */
                this.form.reset({
                    nombre: "",
                    estado: null
                });
            }
        });
    }

    /*
        Metodo para cerrar el dialogo y limpiar el formulario.
    */
    cerrarDialog(): void {
        /*
            Se resetea la señal metaSeleccionada a null.
        */
        this.metaSeleccionada.set(null);
        /*
            Se resetea el formulario a sus valores iniciales.
        */
        this.form.reset({
            nombre: "",
            estado: null
        });
        /*
            Se cierra el dialogo.
        */
        this.visible.set(false);
    }
    
    /*
        Metodo para guardar la meta.
    */
    guardarMeta(): void {
        /*
            Si el formulario no es valido, se marca todos los campos como tocados y se muestra un mensaje de error.
        */
        if (!this.form.valid) {
            /*
                Se marca todos los campos del formulario como tocados.
            */
            this.form.markAllAsTouched();
            /*
                Se muestra un mensaje de error indicando que se deben completar todos los campos requeridos.
            */
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos requeridos.' });
            return;
        }
        /*
            Obtiene los valores del formulario.
        */
        const formRawValue = this.form.getRawValue();
        /*
            Si la señal metaSeleccionada() es distinta de null, osea que se esta editando una meta.
        */
        if (this.metaSeleccionada()) {
            /*
                Define el DTO de la meta a actualizar.
            */
            const dto: UpdateMetaDTO = {
                nombre: formRawValue.nombre,
                estado: formRawValue.estado
            };
            /*
                Llama al servicio de gestión de metas para actualizar la meta pasandole el id de la meta y el DTO y se subscribe a la respuesta.
                Esta subscripcion se realiza ya que se utiliza un Observable.
            */
            this.gestionMetaApiClient.actualizarMeta(this.metaSeleccionada()?.id!, dto).subscribe({
                /*
                    Si la respuesta es exitosa, se muestra un mensaje de éxito y se cierra el dialogo.
                */
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Meta actualizada correctamente.' });
                    this.cerrarDialog();
                },
                /*
                    Si la respuesta es un error, se muestra un mensaje de error.
                */
                error: (err) => {
                    let detail: string = "";
                    /*
                        Si el error es un error del cliente (entre 400 y 499), se muestra el mensaje de error del cliente.
                    */
                    if (err.error?.statusCode >= 400 && err.error?.statusCode < 500) {
                        detail = err.error.message;
                    } else {
                        detail = "Ha ocurrido un error al actualizar la meta";
                    }
                    /*
                        Muestra el mensaje de error.
                    */
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: detail });
                }
            });
        /*
            Si la señal metaSeleccionada() es null, se esta creando una meta.
        */
        } else {
            
            const idProyecto = this.idProyecto();
            /*
                Si no se ha proporcionado el ID del proyecto, se muestra un mensaje de error.
            */
            if (!idProyecto) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se ha proporcionado el ID del proyecto.' });
                return;
            }
            /*
                Define el DTO de la meta a crear.
            */
            const dto: CreateMetaDTO = {
                nombre: formRawValue.nombre,
                idProyecto: idProyecto
            };
            /*
                Llama al servicio de gestión de metas para crear la meta pasandole el DTO y se subscribe a la respuesta.
                Esta subscripcion se realiza ya que se utiliza un Observable.
            */
            this.gestionMetaApiClient.crearMeta(dto).subscribe({
                next: () => {
                    /*
                        Muestra un mensaje de éxito.
                    */
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Meta creada correctamente.' });
                    /*
                        Cierra el dialogo.
                    */
                    this.cerrarDialog();
                },
                /*
                    Si la respuesta es un error, se muestra un mensaje de error.
                */
                error: (err) => {
                    let detail: string = "";
                    /*
                        Si el error es un error del cliente (entre 400 y 499), se muestra el mensaje de error del cliente.
                    */
                    if (err.error?.statusCode >= 400 && err.error?.statusCode < 500) {
                        detail = err.error.message;
                    } else {
                        detail = "Ha ocurrido un error al crear la meta";
                    }
                    /*
                        Muestra el mensaje de error.
                    */
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: detail });
                }
            });
        }
    }
}

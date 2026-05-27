import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EstadisticasService } from './estadisticas.service';

@ApiTags('Estadisticas') 
@Controller('estadisticas')
export class EstadisticasController {
    constructor(private readonly estadisticasService: EstadisticasService) { }

    @Get()
    @ApiOperation({ summary: 'Obtener estadísticas generales' }) 
    @ApiResponse({
        status: 200,
        description: 'Devuelve métricas de proyectos, tareas y metas',
    }) 
    async listar() {
        return this.estadisticasService.obtenerEstadisticas();
    }
}


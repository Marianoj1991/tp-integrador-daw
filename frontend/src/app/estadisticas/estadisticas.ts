import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { EstadisticasService } from './estadisticas.service';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, CardModule, DialogModule],
  templateUrl: './estadisticas.html',
  styleUrls: ['./estadisticas.css']
})
export class EstadisticasComponent implements OnChanges, OnInit {
  estadisticas: any;

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  constructor(private estadisticasService: EstadisticasService) { }

  ngOnInit() {
    // inicializamos la signal acá
    this.estadisticas = this.estadisticasService.estadisticas;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && this.visible) {
      this.estadisticasService.cargar();
    }
  }

  onOcultar() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}

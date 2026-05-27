import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog'; 

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, CardModule, DialogModule],
  templateUrl: './estadisticas.html',
  styleUrls: ['./estadisticas.css']
})
export class EstadisticasComponent implements OnInit {
  estadisticas: any;

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get('/api/v1/estadisticas')
      .subscribe(data => {
        console.log('Datos recibidos:', data);
        this.estadisticas = data;
      });
  }

  
  onOcultar() {
    this.visible = false; 
    this.visibleChange.emit(this.visible);
  }

}
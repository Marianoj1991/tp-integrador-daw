import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, HttpClientModule, ToastModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'], 
  providers: [MessageService],
})
export class App {}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ParametrizadorComponent } from './parametrizador/parametrizador.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ParametrizadorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sas-parametrizador';
}

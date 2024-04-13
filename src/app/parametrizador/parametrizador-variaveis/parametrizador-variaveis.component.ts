import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Variavel } from '../parametrizador.interface';

@Component({
  selector: 'app-parametrizador-variaveis',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './parametrizador-variaveis.component.html',
  styleUrl: './parametrizador-variaveis.component.scss'
})
export class ParametrizadorVariaveisComponent {
  public displayedColumns: string[] = ["id", "nome", "tipo", "qtdCasasDecimais", "tamanho", "chave", "actions"];
  public dataSource: MatTableDataSource<Variavel> = new MatTableDataSource<Variavel>([]);
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Variavel } from '../parametrizador.interface';
import { ParametrizadorVariavelFormComponent } from './parametrizador-variavel-form/parametrizador-variavel-form.component';


@Component({
  selector: 'app-parametrizador-variaveis',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './parametrizador-variaveis.component.html',
  styleUrl: './parametrizador-variaveis.component.scss'
})
export class ParametrizadorVariaveisComponent {
  constructor(public dialog: MatDialog){ }
  
  public displayedColumns: string[] = ["id", "nome", "tipo", "qtdCasasDecimais", "tamanho", "chave", "actions"];
  public dataSource: MatTableDataSource<Variavel> = new MatTableDataSource<Variavel>([]);
  public data: Variavel[] = [];

  public onAddVariavel(): void {
    const dialogRef = this.dialog.open(ParametrizadorVariavelFormComponent, {
      width: '800px',
      height: '100vh',
      data: { }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result && result.variavel) {
        const nextID: number = this.data.reduce((max, variavel) => (variavel.id > max ? variavel.id : max), 0) + 1;

        this.data.push({
          id: nextID,
          nome: result.variavel.nome,
          descricao: result.variavel.descricao,
          tipo: result.variavel.tipo.codigo,
          qtdCasasDecimais: result.variavel.qtdCasasDecimais || null,
          tamanho: result.variavel.tamanho,
          isChave: result.variavel.isChave,
          lista: result.variavel.lista || null
        });

        console.log(result.variavel);

        this.dataSource = new MatTableDataSource(this.data);
      }
    });
  }

  public onEditVar(row: Variavel): void {
    const dialogRef = this.dialog.open(ParametrizadorVariavelFormComponent, {
      width: '800px',
      height: '100vh',
      data: { variavel: row }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result && result.variavel) {
        for(let item of this.data) {
          if(item.id == row.id) {
            item.nome = result.variavel.nome;
            item.tipo = result.variavel.tipo.codigo;
            item.descricao = result.variavel.descricao;
            item.qtdCasasDecimais = result.variavel.qtdCasasDecimais || null;
            item.tamanho = result.variavel.tamanho;
            item.isChave = result.variavel.isChave;
            item.lista = result.variavel.lista || null;

            break;
          }
        }

        this.dataSource = new MatTableDataSource(this.data);
      }
    });
  }

  public onDeleteVar(row: Variavel): void {
    let index = 0;

    for(let i = 0; i < this.data.length; i++) {
      if(this.data[i].id === row.id) {
        index = i;
        break;
      }
    }

    this.data.splice(index, 1);

    this.dataSource = new MatTableDataSource(this.data);
  }
}

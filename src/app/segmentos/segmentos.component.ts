import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Segmento } from '../../shared/interfaces/parametrizador.interface';
import { segmentos } from '../../shared/mockups/parametrizador.mockup';
import { MatDialog } from '@angular/material/dialog';
import { SegmentoFormComponent } from './segmento-form/segmento-form.component';

@Component({
  selector: 'app-segmentos',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './segmentos.component.html',
  styleUrl: './segmentos.component.scss'
})
export class SegmentosComponent {
  constructor(public dialog: MatDialog){
    this.data = segmentos;

    this.dataSource = new MatTableDataSource(this.data);
  }

  public displayedColumns: string[] = ["id", "nome", "status", "actions"];
  public dataSource: MatTableDataSource<Segmento> = new MatTableDataSource<Segmento>([]);
  public data: Segmento[] = [];

  public onAddSegmento(): void {
    const dialogRef = this.dialog.open(SegmentoFormComponent, {
      width: '800px',
      height: '100vh',
      data: { }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result && result.segmento && result.type == "create") {
        const nextID: number = this.data.reduce((max, segmento) => (segmento.id > max ? segmento.id : max), 0) + 1;

        this.data.push({
          id: nextID,
          nome: result.segmento.nome,
          descricao: result.segmento.descricao,
          isAtivo: result.segmento.isAtivo
        });

        this.dataSource = new MatTableDataSource(this.data);
      }
    });
  }

  public onDetalhes(row: Segmento): void {
    const dialogRef = this.dialog.open(SegmentoFormComponent, {
      width: '800px',
      height: '100vh',
      data: { segmento: row }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result && result.segmento && result.type == "update") {
        for(let segmento of this.data) {
          if(segmento.id == result.segmento.id) {
            segmento.descricao = result.segmento.descricao;
            segmento.isAtivo = result.segmento.isAtivo;
          }
        }

        this.dataSource = new MatTableDataSource(this.data);
      }
    });
  }
}

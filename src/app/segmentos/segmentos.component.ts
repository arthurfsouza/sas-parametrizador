import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule, Sort } from '@angular/material/sort';
import { SegmentoFormComponent } from './segmento-form/segmento-form.component';
import { DatatablePaginatorComponent, DatatablePaginatorSource } from '../../shared/components/datatable-paginator/datatable-paginator.component';
import { Segmento } from '../../shared/interfaces/parametrizador.interface';
import { segmentos } from '../../shared/mockups/parametrizador.mockup';
import StringUtils from '../../shared/utils/string.utils';

@Component({
  selector: 'app-segmentos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    DatatablePaginatorComponent
  ],
  templateUrl: './segmentos.component.html',
  styleUrl: './segmentos.component.scss'
})
export class SegmentosComponent {
  @ViewChild("paginator") public paginator!: DatatablePaginatorComponent;

  constructor(public dialog: MatDialog){
    // for(let i = 0; i < 50; i++) { this.data.push(...segmentos); }

    this.data = segmentos;
    this.originalData = this.data;
    this.dataSource = new MatTableDataSource(this.data);

    this.filterFG.controls['filter'].valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.data = this.originalData;

      if(value.length >= 3) {
        this.data = this.data.filter(
          segmento => StringUtils.replaceAllSpecialCharacters(segmento.nome || "").includes(
            StringUtils.replaceAllSpecialCharacters(value)
          )
        );
      }

      if(this.paginator) {
        this.paginator.dataSize = this.data.length;
        this.paginator.setPage(1);
      }
    });
  }

  public filterFG: FormGroup = new FormGroup({
    filter: new FormControl("", [Validators.minLength(3)])
  });

  public displayedColumns: string[] = ["id", "nome", "status", "actions"];
  public dataSource: MatTableDataSource<Segmento> = new MatTableDataSource<Segmento>([]);
  public data: Segmento[] = [];
  public originalData: Segmento[] = [];

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

  public compareOrder(a: number | string | Date, b: number | string | Date, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public sortChange(sort: Sort): void {
    const data = this.data.slice();
    let sortedData: any[] = [];

    if (!sort.active || sort.direction === "") {
      sortedData = data;
      
      if(this.paginator) {
        this.data = sortedData;
        this.paginator.setPage(1);
        this.dataSource = new MatTableDataSource(
          this.data.slice(this.paginator.source.startIndex, this.paginator.source.endIndex + 1)
        );
      }
      
      return;
    }

    sortedData = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === "asc";

      switch (sort.active) {
        case "nome":
          return this.compareOrder(a.nome, b.nome, isAsc);
        case "status":
          return this.compareOrder(a.isAtivo ? "ativo" : "inativo", b.isAtivo ? "ativo" : "inativo", isAsc);

        default:
          return 0;
      }
    });

    if(this.paginator) {
      this.data = sortedData;
      this.paginator.setPage(1);
      this.dataSource = new MatTableDataSource(
        this.data.slice(this.paginator.source.startIndex, this.paginator.source.endIndex + 1)
      );
    }
  }

  public onSourceChanged(source$: DatatablePaginatorSource): void {
    this.dataSource = new MatTableDataSource(this.data.slice(source$.startIndex, source$.endIndex + 1));
  }
}

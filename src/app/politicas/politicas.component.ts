import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PoliticaFormComponent } from './politica-form/politica-form.component';
import { DatatablePaginatorComponent, DatatablePaginatorSource } from '../../shared/components/datatable-paginator/datatable-paginator.component';
import { Politica } from '../../shared/interfaces/parametrizador.interface';
import { politicas } from '../../shared/mockups/parametrizador.mockup';
import StringUtils from '../../shared/utils/string.utils';


@Component({
  selector: 'app-politicas',
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
  templateUrl: './politicas.component.html',
  styleUrl: './politicas.component.scss'
})
export class PoliticasComponent {
  @ViewChild("paginator") public paginator!: DatatablePaginatorComponent;

  constructor(public dialog: MatDialog){
    for(let i = 0; i < 10; i++) { this.data.push(...politicas); }

    // this.data = politicas;

    this.originalData = this.data;
    this.dataSource = new MatTableDataSource(this.data);

    this.filterFG.controls['filter'].valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.data = this.originalData;

      if(value.length >= 3) {
        this.data = this.data.filter(
          politica => StringUtils.replaceAllSpecialCharacters(politica.nome || "").includes(
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

  public displayedColumns: string[] = ["id", "nome", "segmento", "cluster", "status", "actions"];
  public dataSource: MatTableDataSource<Politica> = new MatTableDataSource<Politica>([]);
  public data: Politica[] = [];
  public originalData: Politica[] = [];

  public onAddPolitica(): void {
    const dialogRef = this.dialog.open(PoliticaFormComponent, {
      width: '800px',
      height: '100vh',
      data: { }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result && result.politica && result.type == "create") {
        const nextID: number = this.data.reduce((max, politica) => (politica.id > max ? politica.id : max), 0) + 1;

        this.data.push({
          id: nextID,
          nome: result.politica.nome,
          descricao: result.politica.descricao,
          isAtivo: result.politica.isAtivo,
          cluster: result.politica.cluster
        });

        if(this.paginator) {
          this.paginator.dataSize = this.data.length;
          this.paginator.setPage(1);
        }
      }
    });
  }

  public onDetalhes(row: Politica): void {
    const dialogRef = this.dialog.open(PoliticaFormComponent, {
      width: '800px',
      height: '100vh',
      data: { politica: row }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result && result.politica && result.type == "update") {
        for(let politica of this.data) {
          if(politica.id == result.politica.id) {
            politica.descricao = result.politica.descricao;
            politica.isAtivo = result.politica.isAtivo;
            politica.cluster = result.politica.cluster;
          }
        }

        if(this.paginator) {
          this.paginator.dataSize = this.data.length;
          this.paginator.setPage(1);
        }
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
        case "segmento":
          return this.compareOrder(a.cluster.segmento.nome, b.cluster.segmento.nome, isAsc);
        case "cluster":
          return this.compareOrder(a.cluster.nome, b.cluster.nome, isAsc);
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

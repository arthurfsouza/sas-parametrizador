import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatatablePaginatorComponent, DatatablePaginatorSource } from '../../shared/components/datatable-paginator/datatable-paginator.component';
import { Cluster, Parametrizador, Politica, Segmento } from '../../shared/interfaces/parametrizador.interface';
import StringUtils from '../../shared/utils/string.utils';
import { parametrizadores } from '../../shared/mockups/parametrizador.mockup';
import { ParametrosBuscaAvancadaComponent } from './parametros-busca-avancada/parametros-busca-avancada.component';

@Component({
  selector: 'app-parametros',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatChipsModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    DatatablePaginatorComponent,
    ParametrosBuscaAvancadaComponent
  ],
  templateUrl: './parametros.component.html',
  styleUrl: './parametros.component.scss'
})
export class ParametrosComponent {
  @ViewChild("paginator") public paginator!: DatatablePaginatorComponent;

  constructor(public dialog: MatDialog, private _router: Router){
    for(let i = 0; i < 10; i++) { this.data.push(...parametrizadores); }

    // this.data = [];

    this.originalData = this.data;
    this.dataSource = new MatTableDataSource(this.data);

    this.filterFG.controls['filter'].valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.data = this.originalData;

      if(value.length >= 3) {
        this.data = this.data.filter(
          parametrizador => StringUtils.replaceAllSpecialCharacters(parametrizador?.parametro?.nome || "").includes(
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

  public displayedColumns: string[] = ["id", "nome", "segmento", "cluster", "politica", "variavel", "versao", "status", "actions"];
  public dataSource: MatTableDataSource<Parametrizador> = new MatTableDataSource<Parametrizador>([]);
  public data: Parametrizador[] = [];
  public originalData: Parametrizador[] = [];

  public statuses: any[] = [
    { id: 1, nome: "Criação", status: "CREATED" },
    { id: 2, nome: "Vigente", status: "ACTIVE" },
    { id: 3, nome: "Aguardando Decisão de Riscos", status: "AWAITING_RISK_DECISION" },
    { id: 4, nome: "Excluído", status: "DELETED" }
  ];
  public buscaAvancada: { segmento: Segmento | null; cluster: Cluster | null; politica: Politica | null; variavel: any; statuses: any[]; } = {
    segmento: null,
    cluster: null,
    politica: null,
    variavel: { id: 1, nome: "Todos", modo: "todos" },
    statuses: this.statuses,
  };
  

  public onAddParametro(): void {
    this._router.navigate(["parametrizador"]);
  }

  public onDetalhes(row: Parametrizador): void {
    this._router.navigate(["parametrizador/" + row.id]);
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
          return this.compareOrder(a.parametro.nome, b.parametro.nomme, isAsc);
        case "segmento":
          return this.compareOrder(a.parametro.cluster.segmento.nome, b.parametro.cluster.segmento.nome, isAsc);
        case "cluster":
          return this.compareOrder(a.parametro.cluster.nome, b.parametro.cluster.nome, isAsc);
        case "politica":
          return this.compareOrder(a.parametro.politica.nome, b.parametro.politica.nome, isAsc);
        case "variavel":
          return this.compareOrder(a.parametro.modo, b.parametro.modo, isAsc);
        case "versao":
          return this.compareOrder(a.versao, b.versao, isAsc);
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

  public removeChip(option: 'segmento' | 'cluster' | 'politica' | 'variavel' | 'statuses'): void {
    if(option == 'segmento') { this.buscaAvancada.segmento = null; }
    else if(option == 'cluster') { this.buscaAvancada.cluster = null; }
    else if(option == 'politica') { this.buscaAvancada.politica = null; }
    else if(option == 'variavel') { this.buscaAvancada.variavel = { id: 1, nome: "Todos", modo: "todos" }; }
    else if(option == 'statuses') { this.buscaAvancada.statuses = this.statuses; }
  }

  public getStatuses(): string {
    if(this.buscaAvancada && this.buscaAvancada.statuses && this.buscaAvancada.statuses.length > 0) {
      return this.buscaAvancada.statuses.map(status => status.nome).join(", ");
    }

    return "";
  }

  public onOpenBuscaAvancada(): void {
    const dialogRef = this.dialog.open(ParametrosBuscaAvancadaComponent, {
      width: '800px',
      height: '100vh',
      data: { search: this.buscaAvancada }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result && result.search) {
        this.buscaAvancada = {
          segmento: result.search.segmento || null,
          cluster: result.search.cluster || null,
          politica: result.search.politica || null,
          variavel: result.search.variavel || { id: 1, nome: "Todos", modo: "todos" },
          statuses: result.search.statuses || this.statuses,
        }
      }
    });
  }
}

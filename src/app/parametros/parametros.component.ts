import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ParametrosBuscaAvancadaComponent } from './parametros-busca-avancada/parametros-busca-avancada.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MenuNavigatorComponent } from '../../shared/components/menu-navigator/menu-navigator.component';
import { DatatablePaginatorComponent, DatatablePaginatorSource } from '../../shared/components/datatable-paginator/datatable-paginator.component';
import { parametrizadores } from '../../shared/mockups/parametrizador.mockup';
import StringUtils from '../../shared/utils/string/string.utils';
import { Segmento, Cluster, Politica, Parametro, DataTableAPI, DataTableAPIFilter, ParametroStatus } from '../../shared/interfaces';
import { api } from '../../shared/configurations';
import { parametrosStatus } from '../../shared/mockups';


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
    ParametrosBuscaAvancadaComponent,
    ConfirmDialogComponent,
    MenuNavigatorComponent
  ],
  templateUrl: './parametros.component.html',
  styleUrl: './parametros.component.scss'
})
export class ParametrosComponent {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("paginator") public paginator!: DatatablePaginatorComponent;

  private _http = inject(HttpClient);

  constructor(public dialog: MatDialog, private _router: Router){
    for(let i = 0; i < 10; i++) { this.data.push(...parametrizadores); }

    this.data = [];
    this.dataSource = new MatTableDataSource(this.data);

    this.filterFG.controls['filter'].valueChanges.pipe(debounceTime(500)).subscribe(value => {
      if(value.length >= 3) {
        this._loadingParametros();
      }

      this.dataSource = new MatTableDataSource(this.data);

      if(this.paginator) {
        this.paginator.dataSize = this.data.length;
        this.paginator.setPage(1);
      }
    });
  }

  public filterFG: FormGroup = new FormGroup({
    filter: new FormControl("", [Validators.minLength(3)])
  });

  public displayedColumns: string[] = ["nome", "segmento", "cluster", "politica", "variavel", "versao", "status", "actions"];
  public dataSource: MatTableDataSource<Parametro> = new MatTableDataSource<Parametro>([]);
  public data: Parametro[] = [];

  public parametrosStatus: ParametroStatus[] = parametrosStatus.filter(ps => ps.type != "DELETED");

  public buscaAvancada: { segmento: Segmento | null; cluster: Cluster | null; politica: Politica | null; variavel: any; parametrosStatus: any[]; } = {
    segmento: null,
    cluster: null,
    politica: null,
    variavel: { id: 1, nome: "Todos", modo: "todos" },
    parametrosStatus: this.parametrosStatus,
  };

  public filters: DataTableAPIFilter[] = [];

  ngOnInit(): void {
    this._loadingParametros();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  private _loadingParametros(): void {
    this.data = [];
    this.dataSource = new MatTableDataSource(this.data);

    const order: any = this.sort != null && this.sort.active != null && 
      this.sort.direction != null && this.sort.direction != "" ? 
        { column: this.sort.active, direction: this.sort.direction.toUpperCase() } : null;

    this.filters = [];

    if(this.buscaAvancada.segmento?.id) {
      if(!this.filters.find(f => f.column == "segmento")) {
        this.filters.push({ column: "segmento", value: this.buscaAvancada.segmento.id });
      }
    }

    if(this.buscaAvancada.cluster?.id) {
      if(!this.filters.find(f => f.column == "cluster")) {
        this.filters.push({ column: "cluster", value: this.buscaAvancada.cluster.id });
      }
    }

    if(this.buscaAvancada.politica?.id) {
      if(!this.filters.find(f => f.column == "politica")) {
        this.filters.push({ column: "politica", value: this.buscaAvancada.politica.id });
      }
    }

    if(this.buscaAvancada.variavel?.id != 1) {
      if(!this.filters.find(f => f.column == "variavel")) {
        this.filters.push({ column: "variavel", value: this.buscaAvancada.variavel.modo });
      }
    }

    if(this.buscaAvancada.parametrosStatus?.length > 0 && this.buscaAvancada.parametrosStatus?.length < this.parametrosStatus.length) {
      if(!this.filters.find(f => f.column == "status")) {
        let statuses: string = "";
        this.buscaAvancada.parametrosStatus.map(ps => statuses += (ps.code + ","));

        if(statuses.length > 0) { statuses = statuses.substring(0, statuses.length - 1); }

        this.filters.push({ column: "status", value: statuses });
      }
    }

    const body: any = {
      offset: 0,
      limit: 25,
      order: order,
      filters: this.filters
    };

    // this._http.get("/assets/payload/parametros-datatable.json").subscribe(
    this._http.post(api.private.parametro.getAll, body).subscribe(
      (response: any) => {
        const datatable: DataTableAPI = response;

        if(datatable) {
          if(datatable.offset) { this.paginator.initialPage = datatable.offset; }
          // if(datatable.limit) { this.paginator.dataSize = datatable.limit; }
          if(datatable.order) {
            // console.log(datatable.order)
            // this.sort.active = datatable.order.column;
            // this.sort.direction = datatable.order.direction == "ASC" ? "asc" : "desc";
          }
          if(datatable.count) { this.paginator.dataSize = datatable.count; }
          if(datatable.filters) { this.filters = datatable.filters; }

          const parametros: Parametro[] = datatable.items || [];

          if(parametros && parametros.length > 0) {
            this.data = parametros;
            this.dataSource = new MatTableDataSource(this.data);
            // this.dataSource.sort = this.sort;
          }
        }
      }
    );
  }
  

  public onAddParametro(): void {
    this._router.navigate(["parametrizador"]);
  }

  public onDetalhes(row: any): void { // Parametrizador
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

  public removeChip(option: 'segmento' | 'cluster' | 'politica' | 'variavel' | 'parametrosStatus'): void {
    if(option == 'segmento') { this.buscaAvancada.segmento = null; }
    else if(option == 'cluster') { this.buscaAvancada.cluster = null; }
    else if(option == 'politica') { this.buscaAvancada.politica = null; }
    else if(option == 'variavel') { this.buscaAvancada.variavel = { id: 1, nome: "Todos", modo: "todos" }; }
    else if(option == 'parametrosStatus') { this.buscaAvancada.parametrosStatus = this.parametrosStatus; }
  }

  public getParametrosStatus(): string {
    if(this.buscaAvancada && this.buscaAvancada.parametrosStatus && this.buscaAvancada.parametrosStatus.length > 0) {
      return this.buscaAvancada.parametrosStatus.map(status => status.description).join(", ");
    }

    return "";
  }

  public getStatusName(parametroStatus: ParametroStatus): string {
    const parametroStatusAux: ParametroStatus | undefined = parametrosStatus.find(ps => ps.type == parametroStatus.type);

    return parametroStatusAux?.description || "-";
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
          parametrosStatus: result.search.parametrosStatus || this.parametrosStatus
        }
      }

      this._loadingParametros();
    });
  }

  public onEditarParametro(row: any): void { // Parametrizador
    this._router.navigate(["parametrizador/" + row.id]);
  }

  public onDeletarParametro(row: any): void { // Parametrizador
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      height: '300px',
      data: {
        title: "EXCLUSÃO DE PARÂMETRO",
        description: `<p>Você tem certeza que deseja excluir o parâmetro <b>${row.parametro?.nome}</b>?</p>`,
        descriptionType: "HTML",
        buttonText: "Excluir"
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result == "delete") {
        console.log("Excluir Parâmetro");
      }
    });
  }
}

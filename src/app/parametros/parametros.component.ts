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
import { ParametroService, SnackbarMessagesService } from '../../shared/services';
import { Segmento, Cluster, Politica, Parametro, DataTableAPI, DataTableAPIFilter, ParametroStatus } from '../../shared/interfaces';
import { parametrosStatus } from '../../shared/mockups';
import { api } from '../../shared/configurations';

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
  private _snackbar = inject(SnackbarMessagesService);
  private _parametro = inject(ParametroService);

  constructor(public dialog: MatDialog, private _router: Router){
    this.filterFG.controls['filter'].valueChanges.pipe(debounceTime(500)).subscribe(value => {
      if(value.length >= 3) { this._loadingParametros(); }
    });
  }

  public filterFG: FormGroup = new FormGroup({
    filter: new FormControl("", [Validators.minLength(3)])
  });

  public displayedColumns: string[] = ["nome", "segmento", "cluster", "politica", "variavel", "versao", "status", "actions"];
  public dataSource: MatTableDataSource<Parametro> = new MatTableDataSource<Parametro>([]);
  public data: Parametro[] = [];
  public datatable!: DataTableAPI;

  public filters: DataTableAPIFilter[] = [];
  public parametrosStatus: ParametroStatus[] = parametrosStatus.filter(ps => ps.type != "DELETED");
  public buscaAvancada: { segmento: Segmento | null; cluster: Cluster | null; politica: Politica | null; variavel: any; parametrosStatus: any[]; } = {
    segmento: null,
    cluster: null,
    politica: null,
    variavel: { id: 1, nome: "Todos", modo: "todos" },
    parametrosStatus: this.parametrosStatus
  };

  public statusParaDetalhes: string[] = [
    "AVAILABLE_FOR_REVIEW", "ANALYTICAL_ENVIRONMENT",
    "PENDING_INITIAL_APPROVAL", "INITIAL_APPROVAL_REFUSED", 
    "INITIAL_APPROVAL_COMPLETED", "PENDING_FINAL_APPROVAL",
    "FINAL_APPROVAL_REFUSED", "FINAL_APPROVAL_COMPLETED",
    "AWAITING_IMPLEMENTATION", "PRODUCTION_ENVIRONMENT"
  ];

  ngOnInit(): void { 
    this._loadingParametros();
  }

  private _loadingParametros(): void {
    this.data = [];
    this.filters = [];
    this.dataSource = new MatTableDataSource(this.data);

    const order: any = this.sort != null && this.sort.active != null && 
      this.sort.direction != null && this.sort.direction != "" ? 
        { column: this.sort.active, direction: this.sort.direction.toUpperCase() } : null;

    if(this.filterFG.controls['filter'].value?.length >= 3) {
      if(!this.filters.find(f => f.column == "nome")) {
        this.filters.push({ column: "nome", value: this.filterFG.controls['filter'].value });
      }
    }

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

    const offset: number = this.paginator?.source?.currentPage > 0 ?
      (this.paginator.source.currentPage - 1) : 0;
    const limit: number = this.paginator?.source?.pageSize > 0 ?
    (this.paginator.source.pageSize) : 25;

    const body: any = {
      offset: offset,
      limit: limit,
      order: order,
      filters: this.filters
    };

    // this._http.get("/assets/payload/parametros-datatable.json").subscribe(
    this._http.post(api.private.parametro.getAll, body).subscribe(
      (response: any) => {
        this.datatable = response;

        if(this.datatable) {
          const parametros: Parametro[] = this.datatable.items || [];

          if(parametros && parametros.length > 0) {
            this.data = parametros;
            this.dataSource = new MatTableDataSource(this.data);
          }
        }
      }
    );
  }
  

  public onAddParametro(): void {
    this._parametro.setParametro(null);
    this._parametro.setIsEditavel(true);

    this._router.navigate(["parametro"]);
  }

  public onDetalhes(row: Parametro): void {
    this._parametro.setParametro(null);
    this._parametro.setIsEditavel(true);
    
    this._router.navigate(["parametro/" + row.id]);
  }

  public compareOrder(a: number | string | Date, b: number | string | Date, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public sortChange(sort: Sort): void {
    this._loadingParametros();
  }

  public onSourceChanged(source$: DatatablePaginatorSource): void {
    if(this.paginator?.source?.currentPage) { this.paginator.source.currentPage = 1; }
    
    this._loadingParametros();
  }

  public removeChip(option: 'segmento' | 'cluster' | 'politica' | 'variavel' | 'parametrosStatus'): void {
    if(option == 'segmento') { this.buscaAvancada.segmento = null; }
    else if(option == 'cluster') { this.buscaAvancada.cluster = null; }
    else if(option == 'politica') { this.buscaAvancada.politica = null; }
    else if(option == 'variavel') { this.buscaAvancada.variavel = { id: 1, nome: "Todos", modo: "todos" }; }
    else if(option == 'parametrosStatus') { this.buscaAvancada.parametrosStatus = this.parametrosStatus; }

    this._loadingParametros();
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

  public onEditarParametro(row: Parametro): void {
    this._router.navigate(["parametro/" + row.id]);
  }

  public onDeletarParametro(row: Parametro): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      height: '300px',
      data: {
        title: "EXCLUSÃO DE PARÂMETRO",
        description: `<p>Você tem certeza que deseja excluir o parâmetro <b>${row?.nome}</b>?</p>`,
        descriptionType: "HTML",
        buttonText: "Excluir"
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result == "delete") {
        this._http.delete(api.private.parametro.delete.replace("{PARAMETRO_ID}", row.id)).subscribe(
          (response: any) => {
            if(response?.message) {
              this._snackbar.showSnackbarMessages({ message: response.message, type: 'success', has_duration: true });
              this._loadingParametros();
            }
          },
          err => {
            if(err?.error?.error) {
              this.showErros({ error: err.error.error, campos_error: err.error.campos_error || [] });
            }
          }
        );
      }
    });
  }

  public showErros(e: { error: string, campos_error: string[] }): void {
    this._snackbar.showSnackbarMessages({ message: e.error, type: 'error', has_duration: true });
  }
}
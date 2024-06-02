import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatatablePaginatorComponent, DatatablePaginatorSource } from '../../shared/components/datatable-paginator/datatable-paginator.component';
import { PoliticaFormComponent } from './politica-form/politica-form.component';
import { MenuNavigatorComponent } from '../../shared/components/menu-navigator/menu-navigator.component';
import { Politica } from '../../shared/interfaces';
import { api } from '../../shared/configurations';
import StringUtils from '../../shared/utils/string/string.utils';

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
    DatatablePaginatorComponent,
    MenuNavigatorComponent
  ],
  templateUrl: './politicas.component.html',
  styleUrl: './politicas.component.scss'
})
export class PoliticasComponent {
  @ViewChild("paginator") public paginator!: DatatablePaginatorComponent;

  private _http = inject(HttpClient);

  constructor(public dialog: MatDialog){
    this.filterFG.controls['filter'].valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.data = this.originalData;

      if(value.length >= 3) {
        this.data = this.data.filter(
          politica => StringUtils.replaceAllSpecialCharacters(politica.nome || "").includes(
            StringUtils.replaceAllSpecialCharacters(value)
          )
        );
      }
    });
  }

  public filterFG: FormGroup = new FormGroup({
    filter: new FormControl("", [Validators.minLength(3)])
  });

  public displayedColumns: string[] = ["nome", "segmento", "cluster", "status", "actions"];
  public dataSource: MatTableDataSource<Politica> = new MatTableDataSource<Politica>([]);
  public data: Politica[] = [];
  public originalData: Politica[] = [];

  ngOnInit(): void {
    this._loadingPoliticas();
  }

  private _loadingPoliticas(): void {
    this.data = [];
    this.originalData = this.data;
    this.dataSource = new MatTableDataSource(this.data);

    this._http.get(api.private.politica.get).subscribe(
      response => {
        console.log("Listagem de Políticas: ", response);

        if(this.paginator) {
          this.paginator.dataSize = this.data.length;
          this.paginator.setPage(1);
        }
      }
    );
  }

  public onAddPolitica(): void {
    const dialogRef = this.dialog.open(PoliticaFormComponent, {
      width: '800px',
      height: '100vh',
      data: { }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result && result.politica && result.type == "create") {
        this._loadingPoliticas();
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
        this._loadingPoliticas();
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

    sortedData = data.sort((a: Politica, b: Politica) => {
      const isAsc = sort.direction === "asc";

      switch (sort.active) {
        case "nome":
          return this.compareOrder(a.nome, b.nome, isAsc);
        case "segmento":
          return this.compareOrder(a?.cluster?.segmento?.nome || "", b?.cluster?.segmento?.nome || "", isAsc);
        case "cluster":
          return this.compareOrder(a?.cluster?.nome || "", b?.cluster?.nome || "", isAsc);
        case "status":
          return this.compareOrder(a.is_ativo ? "ativo" : "inativo", b.is_ativo ? "ativo" : "inativo", isAsc);

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

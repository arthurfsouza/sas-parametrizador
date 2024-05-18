import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule, Sort } from '@angular/material/sort';
import { ClusterFormComponent } from './cluster-form/cluster-form.component';
import { DatatablePaginatorComponent, DatatablePaginatorSource } from '../../shared/components/datatable-paginator/datatable-paginator.component';
import { MenuNavigatorComponent } from '../../shared/components/menu-navigator/menu-navigator.component';
import { Cluster } from '../../shared/interfaces/parametrizador.interface';
import { clusters } from '../../shared/mockups/parametrizador.mockup';
import StringUtils from '../../shared/utils/string.utils';

@Component({
  selector: 'app-clusters',
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
  templateUrl: './clusters.component.html',
  styleUrl: './clusters.component.scss'
})
export class ClustersComponent {
  @ViewChild("paginator") public paginator!: DatatablePaginatorComponent;

  constructor(public dialog: MatDialog){
    for(let i = 0; i < 25; i++) { this.data.push(...clusters); }

    // this.data = clusters;

    this.originalData = this.data;
    this.dataSource = new MatTableDataSource(this.data);

    this.filterFG.controls['filter'].valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.data = this.originalData;

      if(value.length >= 3) {
        this.data = this.data.filter(
          cluster => StringUtils.replaceAllSpecialCharacters(cluster.nome || "").includes(
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

  public displayedColumns: string[] = ["id", "nome", "segmento", "status", "actions"];
  public dataSource: MatTableDataSource<Cluster> = new MatTableDataSource<Cluster>([]);
  public data: Cluster[] = [];
  public originalData: Cluster[] = [];

  public onAddCluster(): void {
    const dialogRef = this.dialog.open(ClusterFormComponent, {
      width: '800px',
      height: '100vh',
      data: { }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result && result.cluster && result.type == "create") {
        const nextID: number = this.data.reduce((max, cluster) => (cluster.id > max ? cluster.id : max), 0) + 1;

        this.data.push({
          id: nextID,
          nome: result.cluster.nome,
          descricao: result.cluster.descricao,
          isAtivo: result.cluster.isAtivo,
          segmento: result.cluster.segmento
        });

        if(this.paginator) {
          this.paginator.dataSize = this.data.length;
          this.paginator.setPage(1);
        }
      }
    });
  }

  public onDetalhes(row: Cluster): void {
    const dialogRef = this.dialog.open(ClusterFormComponent, {
      width: '800px',
      height: '100vh',
      data: { cluster: row }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result && result.cluster && result.type == "update") {
        for(let cluster of this.data) {
          if(cluster.id == result.cluster.id) {
            cluster.descricao = result.cluster.descricao;
            cluster.isAtivo = result.cluster.isAtivo;
            cluster.segmento = result.cluster.segmento;
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
          return this.compareOrder(a.segmento.nome, b.segmento.nome, isAsc);
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

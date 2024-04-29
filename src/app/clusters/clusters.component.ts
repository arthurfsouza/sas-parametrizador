import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Cluster } from '../../shared/interfaces/parametrizador.interface';
import { clusters } from '../../shared/mockups/parametrizador.mockup';
import { ClusterFormComponent } from './cluster-form/cluster-form.component';

@Component({
  selector: 'app-clusters',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './clusters.component.html',
  styleUrl: './clusters.component.scss'
})
export class ClustersComponent {
  constructor(public dialog: MatDialog){
    this.data = clusters;

    this.dataSource = new MatTableDataSource(this.data);
  }

  public displayedColumns: string[] = ["id", "nome", "segmento", "status", "actions"];
  public dataSource: MatTableDataSource<Cluster> = new MatTableDataSource<Cluster>([]);
  public data: Cluster[] = [];

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

        this.dataSource = new MatTableDataSource(this.data);
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

        this.dataSource = new MatTableDataSource(this.data);
      }
    });
  }
}

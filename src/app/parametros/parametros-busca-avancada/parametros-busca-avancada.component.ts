import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Cluster, Politica, Segmento } from '../../../shared/interfaces/parametrizador.interface';
import { clusters, politicas, segmentos } from '../../../shared/mockups/parametrizador.mockup';

@Component({
  selector: 'app-parametros-busca-avancada',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './parametros-busca-avancada.component.html',
  styleUrl: './parametros-busca-avancada.component.scss'
})
export class ParametrosBuscaAvancadaComponent {
  constructor(
    public dialogRef: MatDialogRef<ParametrosBuscaAvancadaComponent>,  @Inject(MAT_DIALOG_DATA) public data: any) {
      if(this.data) {
        
      }
  }

  public segmentos: Segmento[] = segmentos;
  public clusters: Cluster[] = clusters;
  public politicas: Politica[] = politicas;
  public variaveis: any[] = [
    { id: 1, nome: "Todos", modo: "todos" }, { id: 2, nome: "Chave", modo: "chave" }, { id: 3, nome: "Global", modo: "global" }
  ];
  public statuses: any[] = [
    { id: 1, nome: "Criação", status: "CREATED" },
    { id: 2, nome: "Vigente", status: "ACTIVE" },
    { id: 3, nome: "Aguardando Decisão de Riscos", status: "AWAITING_RISK_DECISION" },
    { id: 4, nome: "Excluído", status: "DELETED" }
  ];

  public buscaAvancadaFG: FormGroup = new FormGroup({
    segmento: new FormControl(null),
    cluster: new FormControl(null),
    politica: new FormControl(null),
    variavel: new FormControl({id: 1, nome: "Todos", modo: "todos" }),
    statuses: new FormControl(this.statuses)
  });

  public onChangeSegmento(event$: any): void {
    this.buscaAvancadaFG.controls['cluster'].setValue(null);

    if(event$ && event$.value && event$.value.id) {
      this.clusters = clusters.filter(c => c.segmento.id == event$.value.id);
    }
  }

  public onChangeCluster(event$: any): void {
    this.buscaAvancadaFG.controls['politica'].setValue(null);

    if(event$ && event$.value && event$.value.id) {
      this.politicas = politicas.filter(p => p.cluster.id == event$.value.id);
    }
  }

  public onChangePolitica(event$: any): void { }

  public onChangeVariavel(event$: any): void { }

  public onChangeStatus(event$: any): void { }

  public onClear(): void {
    this.buscaAvancadaFG.reset();

    this.segmentos = segmentos;
    this.clusters = clusters;
    this.politicas = politicas;

    this.buscaAvancadaFG.controls['variavel'].setValue({id: 1, nome: "Todos", modo: "todos" });
    this.buscaAvancadaFG.controls['statuses'].setValue(this.statuses);
  }

  public onSearch(): void {
    this.dialogRef.close({ search: this.buscaAvancadaFG.value }); 
  }

  public compareObjects(o1: any, o2: any): boolean {
    return o1?.id === o2?.id;
  }
}
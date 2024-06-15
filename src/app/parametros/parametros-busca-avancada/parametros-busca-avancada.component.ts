import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Segmento, Cluster, Politica, ParametroStatus } from '../../../shared/interfaces';
import { parametrosStatus } from '../../../shared/mockups';
import { api } from '../../../shared/configurations';

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
  private _http = inject(HttpClient);

  constructor(
    public dialogRef: MatDialogRef<ParametrosBuscaAvancadaComponent>,  @Inject(MAT_DIALOG_DATA) public data: { search: any}) {
      if(this.data?.search) {
        if(this.data.search.segmento?.id) { this.buscaAvancadaFG.controls['segmento'].setValue(this.data.search.segmento); }
        else { this.buscaAvancadaFG.controls['cluster'].disable(); }

        if(this.data.search.cluster?.id) { this.buscaAvancadaFG.controls['cluster'].setValue(this.data.search.cluster); }
        else { this.buscaAvancadaFG.controls['politica'].disable(); }

        if(this.data.search.politica?.id) { this.buscaAvancadaFG.controls['politica'].setValue(this.data.search.politica); }

        if(this.data.search.variavel?.id) { this.buscaAvancadaFG.controls['variavel'].setValue(this.data.search.variavel); }

        if(this.data.search.parametrosStatus?.length > 0) {
          this.buscaAvancadaFG.controls['parametrosStatus'].setValue(this.data.search.parametrosStatus); 
        }
      }
  }

  public segmentos: Segmento[] = [];
  public clusters: Cluster[] = [];
  public politicas: Politica[] = [];

  public clustersOriginal: Cluster[] = [];
  public politicasOriginal: Politica[] = [];

  public parametrosStatus: ParametroStatus[] = parametrosStatus.filter(ps => ps.type != "DELETED");
  public variaveis: any[] = [
    { id: 1, nome: "Todos", modo: "todos" },
    { id: 2, nome: "Chave", modo: "CHAVE" },
    { id: 3, nome: "Global", modo: "GLOBAL" }
  ];
  
  public buscaAvancadaFG: FormGroup = new FormGroup({
    segmento: new FormControl(null),
    cluster: new FormControl(null),
    politica: new FormControl(null),
    variavel: new FormControl({ id: 1, nome: "Todos", modo: "TODOS" }, [Validators.required]),
    parametrosStatus: new FormControl(this.parametrosStatus, [Validators.required])
  });

  ngOnInit(): void {
    this._loadingSegmentos();
    this._loadingClusters();
    this._loadingPoliticas();
  }

  private _loadingSegmentos(): void {
    this.segmentos = [];

    this._http.get(api.private.segmento.getAll).subscribe(
      response => {
        const segmentos: Segmento[] = response as any || [];

        if(segmentos && segmentos.length > 0) {
          this.segmentos = segmentos; // segmentos.filter(s => s.is_ativo == true);
        }
      }
    );
  }

  private _loadingClusters(): void {
    this.clusters = [];
    this.clustersOriginal = [];

    this._http.get(api.private.cluster.getAll).subscribe(
      response => {
        const clusters: Cluster[] = response as any || [];

        if(clusters && clusters.length > 0) {
          this.clustersOriginal = this.clusters = clusters; // clusters.filter(c => c.is_ativo == true);
        }
      }
    );
  }

  private _loadingPoliticas(): void {
    this.politicas = [];
    this.politicasOriginal = [];

    this._http.get(api.private.politica.getAll).subscribe(
      response => {
        const politicas: Politica[] = response as any || [];

        if(politicas && politicas.length > 0) {
          this.politicasOriginal = this.politicas = politicas; // politicas.filter(p => p.is_ativo == true);
        }
      }
    );
  }

  public onChangeSegmento(event$: any): void {
    this.buscaAvancadaFG.controls['cluster'].setValue(null);

    if(event$ && event$.value && event$.value.id) {
      this.clusters = this.clustersOriginal.filter(c => c?.segmento?.id == event$.value.id);
      this.buscaAvancadaFG.controls['cluster'].enable();
    }
  }

  public onChangeCluster(event$: any): void {
    this.buscaAvancadaFG.controls['politica'].setValue(null);

    if(event$ && event$.value && event$.value.id) {
      this.politicas = this.politicasOriginal.filter(p => p?.cluster?.id == event$.value.id);
      this.buscaAvancadaFG.controls['politica'].enable();
    }
  }

  public onChangePolitica(event$: any): void { }

  public onChangeVariavel(event$: any): void { }

  public onChangeParametrosStatus(event$: any): void { }

  public onClear(): void {
    this.buscaAvancadaFG.reset();

    this.clusters = this.clustersOriginal;
    this.politicas = this.politicasOriginal;

    this.buscaAvancadaFG.controls['variavel'].setValue({id: 1, nome: "Todos", modo: "todos" });
    this.buscaAvancadaFG.controls['parametrosStatus'].setValue(this.parametrosStatus);

    this.buscaAvancadaFG.controls['cluuster'].disable();
    this.buscaAvancadaFG.controls['politica'].disable();
  }

  public onSearch(): void {
    this.dialogRef.close({ search: this.buscaAvancadaFG.value }); 
  }

  public compareObjects(o1: any, o2: any): boolean {
    return o1?.id === o2?.id;
  }
}
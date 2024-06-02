import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Cluster, Segmento } from '../../../shared/interfaces';
import { api } from '../../../shared/configurations';

@Component({
  selector: 'app-cluster-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
  templateUrl: './cluster-form.component.html',
  styleUrl: './cluster-form.component.scss'
})
export class ClusterFormComponent {
  private _http = inject(HttpClient);

  constructor(public dialogRef: MatDialogRef<ClusterFormComponent>, @Inject(MAT_DIALOG_DATA) public data?: { cluster: Cluster}) {
    if(this.data?.cluster) {
      this.clusterFG.controls['id'].setValue(this.data.cluster.id);
      this.clusterFG.controls['nome'].setValue(this.data.cluster.nome);
      this.clusterFG.controls['descricao'].setValue(this.data.cluster.descricao);
      this.clusterFG.controls['is_ativo'].setValue(this.data.cluster.is_ativo);
      this.clusterFG.controls['segmento'].setValue(this.data.cluster?.segmento);

      this.clusterFG.controls['nome'].disable();
      this.clusterFG.controls['segmento'].disable();
    }
  }

  public clusterFG: FormGroup = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null, [Validators.required, Validators.pattern("[A-Za-z0-9_]+")]),
    descricao: new FormControl(null, [Validators.required, Validators.maxLength(140)]),
    is_ativo: new FormControl(true, [Validators.required]),
    segmento: new FormControl(null, [Validators.required])
  });

  public segmentos: Segmento[] = [];

  ngOnInit(): void {
    this._loadingSegmentos();
  }

  private _loadingSegmentos(): void {
    this.segmentos = [];

    this._http.get(api.private.segmento.get).subscribe(
      response => {
        console.log("Listagem de Segmentos para Combobox: ", response);
        //Necessário filtrar os registros por Segmentos Ativos
      }
    );
  }

  public onChangeSegmento(event$: any): void {
    if(event$ && event$.value && event$.value.id) { }
  }

  public onSave(): void {
    if(!this.clusterFG.valid) { return; }

    let body: any = {
      descricao: this.clusterFG.value['descricao'],
      is_ativo: this.clusterFG.value['is_ativo'],
      
    };

    if(this.data?.cluster?.id) {
      body['id'] = this.clusterFG.value['id'];

      this._http.put(api.private.cluster.put, body).subscribe(
        response => {
          console.log("Atualização do Cluster: ", response);

          this.dialogRef.close({ segmento: this.clusterFG.value, type: "update" });
        }
      );
    }
    else {
      body['nome'] = this.clusterFG.value['nome'];
      body['segmento_id'] = this.clusterFG.value['segmento']?.id;

      this._http.post(api.private.cluster.post, body).subscribe(
        response => {
          console.log("Inclusão do Cluster: ", response);

          this.dialogRef.close({ segmento: this.clusterFG.value, type: "create" });
        }
      );
    }

    if(this.data?.cluster?.id) { this.dialogRef.close({ cluster: this.clusterFG.value, type: "update" }); }
    else { this.dialogRef.close({ cluster: this.clusterFG.value, type: "create" }); }
  }

  public compareObjects(o1: any, o2: any): boolean {
    return o1?.id === o2?.id;
  }
}
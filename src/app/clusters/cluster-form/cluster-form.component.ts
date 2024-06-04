import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { debounceTime } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackbarMessagesService } from '../../../shared/services';
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
  private _snackbar = inject(SnackbarMessagesService);

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

    this.clusterFG.controls['nome'].valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.clusterFG.controls['nome'].setErrors(null);
    });
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
        const segmentos: Segmento[] = response as any || [];

        if(segmentos && segmentos.length > 0) { this.segmentos = segmentos.filter(s => s.is_ativo == true); }
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
      is_ativo: this.clusterFG.value['is_ativo']      
    };

    if(this.data?.cluster?.id) {
      body['id'] = this.clusterFG.value['id'];

      this._http.put(api.private.cluster.put, body).subscribe(
        (response: any) => {
          if(response?.message) {
            this._snackbar.showSnackbarMessages({ message: response.message, type: 'success', has_duration: true });
          }

          this.dialogRef.close({ cluster: this.clusterFG.value, type: "update" });
        }
      );
    }
    else {
      body['nome'] = this.clusterFG.value['nome'];
      body['segmento_id'] = this.clusterFG.value['segmento']?.id;

      this._http.post(api.private.cluster.post, body).subscribe(
        (response: any) => {
          if(response?.message) {
            this._snackbar.showSnackbarMessages({ message: response.message, type: 'success', has_duration: true });
          }

          this.dialogRef.close({ cluster: this.clusterFG.value, type: "create" });
        },
        error => {
          if(error?.error?.error) {
            this._snackbar.showSnackbarMessages({ message: error.error.error, type: 'error', has_duration: true });

            if(error?.error?.campos_error?.length > 0) {
              if(error.error.campos_error.includes("nome")) {
                this.clusterFG.controls['nome'].markAsDirty();
                this.clusterFG.controls['nome'].markAsTouched();
                this.clusterFG.controls['nome'].setErrors({ nomeExistente: true });
              }
            }
          }
        }
      );
    }
  }

  public compareObjects(o1: any, o2: any): boolean {
    return o1?.id === o2?.id;
  }
}
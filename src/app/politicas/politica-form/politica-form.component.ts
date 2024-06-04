import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { debounceTime } from 'rxjs';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackbarMessagesService } from '../../../shared/services';
import { Cluster, Politica, Segmento } from '../../../shared/interfaces';
import { api } from '../../../shared/configurations';

@Component({
  selector: 'app-politica-form',
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
  templateUrl: './politica-form.component.html',
  styleUrl: './politica-form.component.scss'
})
export class PoliticaFormComponent {
  private _http = inject(HttpClient);
  private _snackbar = inject(SnackbarMessagesService);
  
  constructor(public dialogRef: MatDialogRef<PoliticaFormComponent>, @Inject(MAT_DIALOG_DATA) public data?: { politica: Politica }) {
    if(this.data?.politica) {
      this.politicaFG.controls['id'].setValue(this.data.politica.id);
      this.politicaFG.controls['nome'].setValue(this.data.politica.nome);
      this.politicaFG.controls['descricao'].setValue(this.data.politica.descricao);
      this.politicaFG.controls['isAtivo'].setValue(this.data.politica.is_ativo);
      this.politicaFG.controls['cluster'].setValue(this.data.politica?.cluster);
      this.politicaFG.controls['segmento'].setValue(this.data.politica?.cluster?.segmento);

      this.politicaFG.controls['nome'].disable();
      this.politicaFG.controls['cluster'].disable();
      this.politicaFG.controls['segmento'].disable();
    }

    this.politicaFG.controls['nome'].valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.politicaFG.controls['nome'].setErrors(null);
    });
  }

  public politicaFG: FormGroup = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null, [Validators.required, Validators.pattern("[A-Za-z0-9_]+")]),
    descricao: new FormControl(null, [Validators.required, Validators.maxLength(140)]),
    isAtivo: new FormControl(true, [Validators.required]),
    cluster: new FormControl(null, [Validators.required]),
    segmento: new FormControl(null, [Validators.required])
  });

  public segmentos: Segmento[] = [];
  public clusters: Cluster[] = [];

  ngOnInit(): void {
    this.politicaFG.controls['cluster'].disable();

    this._loadingSegmentos();
    this._loadingClusters();
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

  private _loadingClusters(): void {
    this.clusters = [];

    this._http.get(api.private.cluster.get).subscribe(
      response => {
        const clusters: Cluster[] = response as any || [];

        if(clusters && clusters.length > 0) { this.clusters = clusters.filter(c => c.is_ativo == true); }
      }
    );
  }

  public onChangeCluster(event$: any): void {
    
  }

  public onChangeSegmento(event$: any): void {
    this.politicaFG.controls['cluster'].setValue(null);

    if(event$ && event$.value && event$.value.id) {
      this.clusters = this.clusters.filter(c => c.is_ativo == true && c.segmento?.id == event$.value.id);
      this.politicaFG.controls['cluster'].enable();
    }
    else {
      this.politicaFG.controls['cluster'].disable();
    } 
  }

  public onSave(): void {
    if(!this.politicaFG.valid) { return; }

    let body: any = {
      descricao: this.politicaFG.value['descricao'],
      is_ativo: this.politicaFG.value['is_ativo']      
    };

    if(this.data?.politica?.id) {
      body['id'] = this.politicaFG.value['id'];

      this._http.put(api.private.politica.put, body).subscribe(
        (response: any) => {
          if(response?.message) {
            this._snackbar.showSnackbarMessages({ message: response.message, type: 'success', has_duration: true });
          }

          this.dialogRef.close({ politica: this.politicaFG.value, type: "update" });
        }
      );
    }
    else {
      body['nome'] = this.politicaFG.value['nome'];
      body['cluster_id'] = this.politicaFG.value['cluster']?.id;

      this._http.post(api.private.politica.post, body).subscribe(
        (response: any) => {
          if(response?.message) {
            this._snackbar.showSnackbarMessages({ message: response.message, type: 'success', has_duration: true });
          }

          this.dialogRef.close({ politica: this.politicaFG.value, type: "create" });
        },
        error => {
          if(error?.error?.error) {
            this._snackbar.showSnackbarMessages({ message: error.error.error, type: 'error', has_duration: true });

            if(error?.error?.campos_error?.length > 0) {
              if(error.error.campos_error.includes("nome")) {
                this.politicaFG.controls['nome'].markAsDirty();
                this.politicaFG.controls['nome'].markAsTouched();
                this.politicaFG.controls['nome'].setErrors({ nomeExistente: true });
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
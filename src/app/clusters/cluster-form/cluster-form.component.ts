import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { debounceTime } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackbarMessagesService } from '../../../shared/services';
import { ConfirmDialogComponent } from '../../../shared/components';
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

  public clusterFG!: FormGroup;

  constructor(public dialogRef: MatDialogRef<ClusterFormComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data?: { cluster: Cluster}) {
    this.initFormGroup();

    if(this.data?.cluster) {
      this.clusterFG.controls['id'].setValue(this.data.cluster.id);

      this.getClusterByID(this.data.cluster.id);
    }

    this.clusterFG.controls['nome'].valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.clusterFG.controls['nome'].setErrors(null);
    });
  }

  public segmentos: Segmento[] = [];

  public hasAssociation: boolean = true;

  ngOnInit(): void { this._loadingSegmentos(); }

  public initFormGroup(): void {
    this.clusterFG = new FormGroup({
      id: new FormControl(null),
      nome: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.pattern("[A-Za-z0-9_]+")]),
      descricao: new FormControl(null, [Validators.required, Validators.maxLength(350)]),
      is_ativo: new FormControl(true, [Validators.required]),
      segmento: new FormControl(null, [Validators.required])
    });
  }

  public getClusterByID(id: string): void {
    this._http.get(api.private.cluster.getByID.replace("{CLUSTER_ID}", id)).subscribe(
      (response: any) => {
        if(response) {
          const cluster: Cluster = response;

          this.clusterFG.controls['nome'].setValue(cluster.nome);
          this.clusterFG.controls['descricao'].setValue(cluster.descricao);
          this.clusterFG.controls['is_ativo'].setValue(cluster.is_ativo);
          this.clusterFG.controls['segmento'].setValue(cluster.segmento);

          if(cluster.has_association != null) { this.hasAssociation = cluster.has_association; }

          if(this.hasAssociation) {
            this.clusterFG.controls['nome'].disable();
            this.clusterFG.controls['segmento'].disable();
          }
        }
      }
    )
  }

  public onDelete(): void {
    if(!this.hasAssociation && this.clusterFG.value['id'] != null) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '600px',
        height: '300px',
        data: {
          title: "Exclusão do Cluster",
          description: `<p>Esta ação não poderá ser desfeita.</p><p>Tem certeza que deseja excluir o cluster selecionado?</p>`,
          descriptionType: "HTML",
          buttonText: "Excluir"
        }
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if(result == "delete") {
          this._http.delete(api.private.cluster.delete.replace("{CLUSTER_ID}", this.clusterFG.value['id'])).subscribe(
            (response: any) => {
              if(response?.message) {
                this._snackbar.showSnackbarMessages({ message: response.message, type: 'success' });
              }
    
              this.dialogRef.close({ cluster: this.clusterFG.value, type: "delete" });
            }
          );
        }
      });
      
    }
  }

  private _loadingSegmentos(): void {
    this.segmentos = [];

    this._http.get(api.private.segmento.getAll).subscribe(
      response => {
        const segmentos: Segmento[] = response as any || [];

        if(segmentos && segmentos.length > 0) {
          this.segmentos = segmentos.filter(s => s.is_ativo == true);

          if(this.data?.cluster) {
            const segmentoAux: Segmento | undefined = this.segmentos.find(s => s.id == this.clusterFG.controls['segmento'].value?.id);

            if(!segmentoAux) { this.segmentos.push(this.clusterFG.controls['segmento'].value); }            
          }
        }
      }
    );
  }

  public onChangeSegmento(event$: any): void {
    if(event$ && event$.value && event$.value.id) { }
  }

  public onSave(): void {
    if(!this.clusterFG.valid) { return; }

    let body: any = {
      nome: this.clusterFG.value['nome'],
      descricao: this.clusterFG.value['descricao'],
      is_ativo: this.clusterFG.value['is_ativo'],
      segmento_id: this.clusterFG.value['segmento']?.id
    };

    if(this.data?.cluster?.id) {
      if(this.hasAssociation) {
        delete body['nome'];
        delete body['segmento_id'];
      }

      this._http.put(api.private.cluster.put.replace("{CLUSTER_ID}", this.clusterFG.value['id']), body).subscribe(
        (response: any) => {
          if(response?.message) {
            this._snackbar.showSnackbarMessages({ message: response.message, type: 'success', has_duration: true });
          }

          this.dialogRef.close({ cluster: this.clusterFG.value, type: "update" });
        },
        err => {
          if(err?.error?.error) {
            this.showErros({ error: err.error.error, campos_error: err.error.campos_error || [] });
          }
        }
      );
    }
    else {
      this._http.post(api.private.cluster.post, body).subscribe(
        (response: any) => {
          if(response?.message) {
            this._snackbar.showSnackbarMessages({ message: response.message, type: 'success', has_duration: true });
          }

          this.dialogRef.close({ cluster: this.clusterFG.value, type: "create" });
        },
        err => {
          if(err?.error?.error) {
            this.showErros({ error: err.error.error, campos_error: err.error.campos_error || [] });
          }
        }
      );
    }
  }

  public showErros(e: { error: string, campos_error: string[] }): void {
    this._snackbar.showSnackbarMessages({ message: e.error, type: 'error', has_duration: true });

    if(e.campos_error.length > 0) {
      if(e.campos_error.includes("nome")) {
        this.clusterFG.controls['nome'].markAsDirty();
        this.clusterFG.controls['nome'].markAsTouched();
        this.clusterFG.controls['nome'].setErrors({ nomeExistente: true });
      }
    }
  }

  public compareObjects(o1: any, o2: any): boolean { return o1?.id === o2?.id; }
}
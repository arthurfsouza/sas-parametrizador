import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { debounceTime } from 'rxjs';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
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
  
  constructor(public dialogRef: MatDialogRef<PoliticaFormComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data?: { politica: Politica }) {
    if(this.data?.politica) {
      this.politicaFG.controls['id'].setValue(this.data.politica.id);

      this.getPoliticaByID(this.data.politica.id);
    }
    else { this.politicaFG.controls['cluster'].disable(); }

    this.politicaFG.controls['nome'].valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.politicaFG.controls['nome'].setErrors(null);
    });
  }

  public politicaFG: FormGroup = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.pattern("[A-Za-z0-9_]+")]),
    descricao: new FormControl(null, [Validators.required, Validators.maxLength(350)]),
    is_ativo: new FormControl(true, [Validators.required]),
    cluster: new FormControl(null, [Validators.required]),
    segmento: new FormControl(null, [Validators.required])
  });

  public segmentos: Segmento[] = [];
  public clusters: Cluster[] = [];
  public clustersOriginal: Cluster[] = [];

  public hasAssociation: boolean = true;

  ngOnInit(): void {
    this._loadingSegmentos();
    this._loadingClusters();
  }

  public getPoliticaByID(id: string): void {
    this._http.get(api.private.politica.getByID.replace("{POLITICA_ID}", id)).subscribe(
      (response: any) => {
        if(response) {
          const politica: Politica = response;

          this.politicaFG.controls['nome'].setValue(politica.nome);
          this.politicaFG.controls['descricao'].setValue(politica.descricao);
          this.politicaFG.controls['is_ativo'].setValue(politica.is_ativo);
          this.politicaFG.controls['cluster'].setValue(politica.cluster);
          this.politicaFG.controls['segmento'].setValue(politica.cluster?.segmento);          

          if(politica.has_association != null) { this.hasAssociation = politica.has_association; }

          if(this.hasAssociation) {
            this.politicaFG.controls['nome'].disable();
            this.politicaFG.controls['segmento'].disable();
            this.politicaFG.controls['cluster'].disable();
          }
        }
      }
    )
  }

  public onDelete(): void {
    if(!this.hasAssociation && this.politicaFG.value['id'] != null) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '600px',
        height: '300px',
        data: {
          title: "Exclusão da Política",
          description: `<p>Esta ação não poderá ser desfeita.</p><p>Tem certeza que deseja excluir a política selecionado?</p>`,
          descriptionType: "HTML",
          buttonText: "Excluir"
        }
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if(result == "delete") {
          this._http.delete(api.private.politica.delete.replace("{POLITICA_ID}", this.politicaFG.value['id'])).subscribe(
            (response: any) => {
              if(response?.message) {
                this._snackbar.showSnackbarMessages({ message: response.message, type: 'success' });
              }
    
              this.dialogRef.close({ politica: this.politicaFG.value, type: "delete" });
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

          if(this.data?.politica) {
            const segmentoAux: Segmento | undefined = this.segmentos.find(s => s.id == this.politicaFG.controls['segmento'].value?.id);

            if(!segmentoAux) { this.segmentos.push(this.politicaFG.controls['segmento'].value); }            
          }
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
          this.clustersOriginal = this.clusters = clusters.filter(c => c.is_ativo == true);

          if(this.data?.politica) {
            const clusterAux: Cluster | undefined = this.clusters.find(c => c.id == this.politicaFG.controls['cluster'].value?.id);

            if(!clusterAux) { this.clusters.push(this.politicaFG.controls['cluster'].value); }            
          }
        }
      }
    );
  }

  public onChangeCluster(event$: any): void { }

  public onChangeSegmento(event$: any): void {
    this.politicaFG.controls['cluster'].setValue(null);

    if(event$ && event$.value && event$.value.id) {
      this.clusters = this.clustersOriginal.filter(c => c.is_ativo == true && c.segmento?.id == event$.value.id);
      this.politicaFG.controls['cluster'].enable();
    }
    else {
      this.politicaFG.controls['cluster'].disable();
    } 
  }

  public onSave(): void {
    if(!this.politicaFG.valid) { return; }

    let body: any = {
      nome: this.politicaFG.value['nome'],
      descricao: this.politicaFG.value['descricao'],
      is_ativo: this.politicaFG.value['is_ativo'],
      cluster_id: this.politicaFG.value['cluster']?.id
    };

    if(this.data?.politica?.id) {
      if(this.hasAssociation) {
        delete body['nome'];
        delete body['cluster_id'];
      }

      this._http.put(api.private.politica.put.replace("{POLITICA_ID}", this.politicaFG.value['id']), body).subscribe(
        (response: any) => {
          if(response?.message) {
            this._snackbar.showSnackbarMessages({ message: response.message, type: 'success', has_duration: true });
          }

          this.dialogRef.close({ politica: this.politicaFG.value, type: "update" });
        },
        err => {
          if(err?.error?.error) {
            this.showErros({ error: err.error.error, campos_error: err.error.campos_error || [] });
          }
        }
      );
    }
    else {
      this._http.post(api.private.politica.post, body).subscribe(
        (response: any) => {
          if(response?.message) {
            this._snackbar.showSnackbarMessages({ message: response.message, type: 'success', has_duration: true });
          }

          this.dialogRef.close({ politica: this.politicaFG.value, type: "create" });
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
        this.politicaFG.controls['nome'].markAsDirty();
        this.politicaFG.controls['nome'].markAsTouched();
        this.politicaFG.controls['nome'].setErrors({ nomeExistente: true });
      }
    }
  }

  public compareObjects(o1: any, o2: any): boolean { return o1?.id === o2?.id; }
}
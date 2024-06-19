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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackbarMessagesService } from '../../../shared/services';
import { ConfirmDialogComponent } from '../../../shared/components';
import { Segmento } from '../../../shared/interfaces';
import { api } from '../../../shared/configurations';

@Component({
  selector: 'app-segmento-form',
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
    MatSlideToggleModule,
    MatTooltipModule
  ],
  templateUrl: './segmento-form.component.html',
  styleUrl: './segmento-form.component.scss'
})
export class SegmentoFormComponent {
  private _http = inject(HttpClient);
  private _snackbar = inject(SnackbarMessagesService);
  
  constructor(public dialogRef: MatDialogRef<SegmentoFormComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data?: { segmento: Segmento }) {
    if(this.data?.segmento) {
      this.segmentoFG.controls['id'].setValue(this.data.segmento.id);

      this.getSegmentoByID(this.data.segmento.id);
    }

    this.segmentoFG.controls['nome'].valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.segmentoFG.controls['nome'].setErrors(null);
    });
  }

  public segmentoFG: FormGroup = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.pattern("[A-Za-z0-9_]+")]),
    descricao: new FormControl(null, [Validators.required, Validators.maxLength(350)]),
    is_ativo: new FormControl(true, [Validators.required])
  });

  public hasAssociation: boolean = true;

  public getSegmentoByID(id: string): void {
    this._http.get(api.private.segmento.getByID.replace("{SEGMENTO_ID}", id)).subscribe(
      (response: any) => {
        if(response) {
          const segmento: Segmento = response;

          this.segmentoFG.controls['nome'].setValue(segmento.nome);
          this.segmentoFG.controls['descricao'].setValue(segmento.descricao);
          this.segmentoFG.controls['is_ativo'].setValue(segmento.is_ativo);

          if(segmento.has_association != null) { this.hasAssociation = segmento.has_association; }

          if(this.hasAssociation) { this.segmentoFG.controls['nome'].disable(); }
        }
      }
    )
  }

  public onDelete(): void {
    if(!this.hasAssociation && this.segmentoFG.value['id'] != null) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '600px',
        height: '300px',
        data: {
          title: "Exclusão do Segmento",
          description: `<p>Esta ação não poderá ser desfeita.</p><p>Tem certeza que deseja excluir o segmento selecionado?</p>`,
          descriptionType: "HTML",
          buttonText: "Excluir"
        }
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if(result == "delete") {
          this._http.delete(api.private.segmento.delete.replace("{SEGMENTO_ID}", this.segmentoFG.value['id'])).subscribe(
            (response: any) => {
              if(response?.message) {
                this._snackbar.showSnackbarMessages({ message: response.message, type: 'success' });
              }
    
              this.dialogRef.close({ segmento: this.segmentoFG.value, type: "delete" });
            }
          );
        }
      });
      
    }
  }

  public onSave(): void {
    if(!this.segmentoFG.valid) { return; }

    let body: any = {
      nome: this.segmentoFG.value['nome'],
      descricao: this.segmentoFG.value['descricao'],
      is_ativo: this.segmentoFG.value['is_ativo']
    };

    if(this.data?.segmento?.id) {
      if(this.hasAssociation) { delete body['nome']; }

      this._http.put(api.private.segmento.put.replace("{SEGMENTO_ID}", this.segmentoFG.value['id']), body).subscribe(
        (response: any) => {
          if(response?.message) {
            this._snackbar.showSnackbarMessages({ message: response.message, type: 'success' });
          }

          this.dialogRef.close({ segmento: this.segmentoFG.value, type: "update" });
        },
        err => {
          if(err?.error?.error) {
            this.showErros({ error: err.error.error, campos_error: err.error.campos_error || [] });
          }
        }
      );
    }
    else {
      this._http.post(api.private.segmento.post, body).subscribe(
        (response: any) => {
          if(response?.message) {
            this._snackbar.showSnackbarMessages({ message: response.message, type: 'success', has_duration: true });
          }

          this.dialogRef.close({ segmento: this.segmentoFG.value, type: "create" });
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
        this.segmentoFG.controls['nome'].markAsDirty();
        this.segmentoFG.controls['nome'].markAsTouched();
        this.segmentoFG.controls['nome'].setErrors({ nomeExistente: true });
      }
    }
  }
}
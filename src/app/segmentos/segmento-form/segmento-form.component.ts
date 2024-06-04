import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SnackbarMessagesService } from '../../../shared/services';
import { Segmento } from '../../../shared/interfaces';
import { api } from '../../../shared/configurations';
import { debounceTime } from 'rxjs';

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
  
  constructor(public dialogRef: MatDialogRef<SegmentoFormComponent>, @Inject(MAT_DIALOG_DATA) public data?: { segmento: Segmento }) {
    if(this.data?.segmento) {
      this.segmentoFG.controls['id'].setValue(this.data.segmento.id);
      this.segmentoFG.controls['nome'].setValue(this.data.segmento.nome);
      this.segmentoFG.controls['descricao'].setValue(this.data.segmento.descricao);
      this.segmentoFG.controls['is_ativo'].setValue(this.data.segmento.is_ativo);

      this.segmentoFG.controls['nome'].disable();
    }

    this.segmentoFG.controls['nome'].valueChanges.pipe(debounceTime(500)).subscribe(value => {
      this.segmentoFG.controls['nome'].setErrors(null);
    });
  }

  public segmentoFG: FormGroup = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null, [Validators.required, Validators.pattern("[A-Za-z0-9_]+")]),
    descricao: new FormControl(null, [Validators.required, Validators.maxLength(140)]),
    is_ativo: new FormControl(true, [Validators.required])
  });

  public onSave(): void {
    if(!this.segmentoFG.valid) { return; }

    let body: any = {
      descricao: this.segmentoFG.value['descricao'],
      is_ativo: this.segmentoFG.value['is_ativo']
    };

    if(this.data?.segmento?.id) {
      body['id'] = this.segmentoFG.value['id'];

      this._http.put(api.private.segmento.put, body).subscribe(
        (response: any) => {
          if(response?.message) {
            this._snackbar.showSnackbarMessages({ message: response.message, type: 'success' });
          }

          this.dialogRef.close({ segmento: this.segmentoFG.value, type: "update" });
        },
        error => {
          if(error?.message) {
            this._snackbar.showSnackbarMessages({ message: error.message, type: 'error' });
          }          
        }
      );
    }
    else {
      body['nome'] = this.segmentoFG.value['nome'];

      this._http.post(api.private.segmento.post, body).subscribe(
        (response: any) => {
          if(response?.message) {
            this._snackbar.showSnackbarMessages({ message: response.message, type: 'success' });
          }

          this.dialogRef.close({ segmento: this.segmentoFG.value, type: "create" });
        },
        error => {
          if(error?.message) {
            this._snackbar.showSnackbarMessages({ message: error.message, type: 'error' });

            if(error?.campos_error?.length > 0) {
              if(error.campos_error.includes("nome")) {
                this.segmentoFG.controls['nome'].setErrors({ nomeExistente: true });
              }
            }
          }
        }
      );
    }
  }
}
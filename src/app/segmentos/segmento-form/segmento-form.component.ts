import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  constructor(public dialogRef: MatDialogRef<SegmentoFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if(this.data?.segmento) {
      this.segmentoFG.controls['id'].setValue(this.data.segmento.id);
      this.segmentoFG.controls['nome'].setValue(this.data.segmento.nome);
      this.segmentoFG.controls['descricao'].setValue(this.data.segmento.descricao);
      this.segmentoFG.controls['isAtivo'].setValue(this.data.segmento.isAtivo);

      this.segmentoFG.controls['nome'].disable();
    }
  }

  public segmentoFG: FormGroup = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null, [Validators.required, Validators.pattern("[A-Za-z0-9_]+")]),
    descricao: new FormControl(null, [Validators.required, Validators.maxLength(140)]),
    isAtivo: new FormControl(true, [Validators.required])
  });

  public onSave(): void {
    if(!this.segmentoFG.valid) { return; }

    if(this.data?.segmento?.id) { this.dialogRef.close({ segmento: this.segmentoFG.value, type: "update" }); }
    else { this.dialogRef.close({ segmento: this.segmentoFG.value, type: "create" }); }
  }
}

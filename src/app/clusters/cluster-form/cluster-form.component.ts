import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Segmento } from '../../../shared/interfaces/parametrizador.interface';
import { segmentos } from '../../../shared/mockups/parametrizador.mockup';

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
  constructor(public dialogRef: MatDialogRef<ClusterFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if(this.data?.cluster) {
      this.clusterFG.controls['id'].setValue(this.data.cluster.id);
      this.clusterFG.controls['nome'].setValue(this.data.cluster.nome);
      this.clusterFG.controls['descricao'].setValue(this.data.cluster.descricao);
      this.clusterFG.controls['isAtivo'].setValue(this.data.cluster.isAtivo);
      this.clusterFG.controls['segmento'].setValue(this.data.cluster.segmento);

      this.clusterFG.controls['nome'].disable();
    }
  }

  public clusterFG: FormGroup = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null, [Validators.required, Validators.pattern("[A-Za-z0-9_]+")]),
    descricao: new FormControl(null, [Validators.required, Validators.maxLength(140)]),
    isAtivo: new FormControl(true, [Validators.required]),
    segmento: new FormControl(null, [Validators.required])
  });

  public segmentos: Segmento[] = segmentos.filter(s => s.isAtivo == true);

  public onChangeSegmento(event$: any): void {
    if(event$ && event$.value && event$.value.id) {
      
    }
  }

  public onSave(): void {
    if(!this.clusterFG.valid) { return; }

    if(this.data?.cluster?.id) { this.dialogRef.close({ cluster: this.clusterFG.value, type: "update" }); }
    else { this.dialogRef.close({ cluster: this.clusterFG.value, type: "create" }); }
  }

  public compareObjects(o1: any, o2: any): boolean {
    return o1?.id === o2?.id;
  }
}

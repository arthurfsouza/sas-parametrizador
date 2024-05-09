import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Segmento, Cluster } from '../../../shared/interfaces/parametrizador.interface';
import { segmentos, clusters } from '../../../shared/mockups/parametrizador.mockup';

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
  constructor(public dialogRef: MatDialogRef<PoliticaFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if(this.data?.politica) {
      this.politicaFG.controls['id'].setValue(this.data.politica.id);
      this.politicaFG.controls['nome'].setValue(this.data.politica.nome);
      this.politicaFG.controls['descricao'].setValue(this.data.politica.descricao);
      this.politicaFG.controls['isAtivo'].setValue(this.data.politica.isAtivo);
      this.politicaFG.controls['cluster'].setValue(this.data.politica.cluster);
      this.politicaFG.controls['segmento'].setValue(this.data.politica.cluster.segmento);

      this.politicaFG.controls['nome'].disable();
    }
  }

  public politicaFG: FormGroup = new FormGroup({
    id: new FormControl(null),
    nome: new FormControl(null, [Validators.required, Validators.pattern("[A-Za-z0-9_]+")]),
    descricao: new FormControl(null, [Validators.required, Validators.maxLength(140)]),
    isAtivo: new FormControl(true, [Validators.required]),
    cluster: new FormControl(null, [Validators.required]),
    segmento: new FormControl(null, [Validators.required])
  });

  public segmentos: Segmento[] = segmentos.filter(s => s.isAtivo == true);
  public clusters: Cluster[] = clusters.filter(c => c.isAtivo == true);

  ngOnInit(): void {
    this.politicaFG.controls['cluster'].disable();
  }

  public onChangeCluster(event$: any): void {
    
  }

  public onChangeSegmento(event$: any): void {
    this.politicaFG.controls['cluster'].setValue(null);

    if(event$ && event$.value && event$.value.id) {
      this.clusters = clusters.filter(c => c.isAtivo == true && c.segmento.id == event$.value.id);
      this.politicaFG.controls['cluster'].enable();
    }
    else {
      this.politicaFG.controls['cluster'].disable();
    } 
  }

  public onSave(): void {
    if(!this.politicaFG.valid) { return; }

    if(this.data?.politica?.id) { this.dialogRef.close({ politica: this.politicaFG.value, type: "update" }); }
    else { this.dialogRef.close({ politica: this.politicaFG.value, type: "create" }); }
  }

  public compareObjects(o1: any, o2: any): boolean {
    return o1?.id === o2?.id;
  }
}
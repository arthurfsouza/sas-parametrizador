import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ParametroService } from '../../../../shared/services';
import { Cluster, Parametro, Politica } from '../../../../shared/interfaces';
import { api } from '../../../../shared/configurations';

@Component({
  selector: 'app-parametro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule
  ],
  templateUrl: './parametro.component.html',
  styleUrl: './parametro.component.scss'
})
export class ParametroComponent {
  private _http = inject(HttpClient);
  private _parametro = inject(ParametroService);

  constructor() { }

  public parametroFG: FormGroup = new FormGroup({
    nome: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.pattern("[A-Za-z0-9_]+")]),
    descricao: new FormControl(null, [Validators.required, Validators.maxLength(350)]),
    modo: new FormControl(null, [Validators.required]),
    data_hora_vigencia: new FormControl(new Date(), [Validators.required]),
    cluster: new FormControl(null, [Validators.required]),
    politica: new FormControl(null, [Validators.required])
  });

  public parametro!: Parametro;
  
  public clusters: Cluster[] = [];
  public politicas: Politica[] = [];
  public politicasOriginal: Politica[] = [];

  ngOnInit(): void {
    this._loadingClusters();
    this._loadingPoliticas();

    this._parametro.getParametro().subscribe(parametro => {
      if(parametro) {
        this.parametro = parametro;

        if(this.parametro.id) {
          this.parametroFG.controls['nome'].setValue(this.parametro.nome);
          this.parametroFG.controls['descricao'].setValue(this.parametro.descricao);
          this.parametroFG.controls['modo'].setValue(this.parametro.modo);
          // this.parametroFG.controls['data_hora_vigencia'].setValue(this.parametrizador.parametro.dataVigencia);
          this.parametroFG.controls['cluster'].setValue(this.parametro.politica?.cluster);
          this.parametroFG.controls['politica'].setValue(this.parametro.politica);
        }
      }
    });
  }

  private _loadingClusters(): void {
    this.clusters = [];

    this._http.get(api.private.cluster.getAll).subscribe(
      response => {
        const clusters: Cluster[] = response as any || [];

        if(clusters && clusters.length > 0) {
          this.clusters = clusters.filter(c => c.is_ativo == true && c.segmento?.is_ativo == true);
        }
      }
    );
  }

  private _loadingPoliticas(): void {
    this.politicas = [];
    this.politicasOriginal = [];

    this._http.get(api.private.politica.getAll).subscribe(
      response => {
        const politicas: Politica[] = response as any || [];

        if(politicas && politicas.length > 0) {
          this.politicasOriginal = this.politicas = politicas.filter(p => p.is_ativo == true);
        }
      }
    );
  }

  public onChangeCluster(event$: any): void {
    this.parametroFG.controls['politica'].setValue(null);

    if(event$ && event$.value && event$.value.id) {
      this.politicas = this.politicasOriginal.filter(p => p?.cluster?.id == event$.value.id);
      this.parametroFG.controls['politica'].enable();
    }
    else { this.parametroFG.controls['politica'].disable(); }    
  }

  public compareObjects(o1: any, o2: any): boolean { return o1?.id === o2?.id; }
}
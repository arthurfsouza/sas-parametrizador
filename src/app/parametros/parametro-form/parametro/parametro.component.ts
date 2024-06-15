import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import {  MomentDateAdapter, MomentDateModule } from '@angular/material-moment-adapter';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ParametroService } from '../../../../shared/services';
import { Cluster, Parametro, Politica } from '../../../../shared/interfaces';
import { api } from '../../../../shared/configurations';
import 'moment/locale/pt-br';

export const CUSTOM_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'DD/MM/YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
  }
};

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
    MatSelectModule,
    MomentDateModule
  ],
  templateUrl: './parametro.component.html',
  styleUrl: './parametro.component.scss',
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_FORMATS },
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'}
  ]
})
export class ParametroComponent {
  private _http = inject(HttpClient);
  private _parametro = inject(ParametroService);

  constructor() { }

  public minDate: Date = new Date();
  public parametroFG: FormGroup = new FormGroup({
    nome: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.pattern("[A-Za-z0-9_]+")]),
    descricao: new FormControl(null, [Validators.required, Validators.maxLength(350)]),
    modo: new FormControl(null, [Validators.required]),
    data_vigencia: new FormControl(this.minDate, [Validators.required]),
    hora_vigencia: new FormControl(this.minDate, [Validators.required]),
    // data_hora_vigencia: new FormControl(new Date(), [Validators.required]),
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
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MomentDateAdapter, MomentDateModule } from '@angular/material-moment-adapter';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ParametroService, SnackbarMessagesService } from '../../../../shared/services';
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
    MatIconModule,
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
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ]
})
export class ParametroComponent {
  private _http = inject(HttpClient);
  private _snackbar = inject(SnackbarMessagesService);
  private _parametro = inject(ParametroService);

  constructor() { }

  public minDate: Date = new Date();
  public parametroFG: FormGroup = new FormGroup({
    nome: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.pattern("[A-Za-z0-9_]+")]),
    descricao: new FormControl(null, [Validators.required, Validators.maxLength(350)]),
    modo: new FormControl(null, [Validators.required]),
    data_vigencia: new FormControl(this.minDate, [Validators.required]),
    hora_vigencia: new FormControl(null, [Validators.required]),
    cluster: new FormControl(null, [Validators.required]),
    politica: new FormControl(null, [Validators.required])
  });

  public parametro!: Parametro;
  public parametroIsEditavel: boolean = true;
  
  public clusters: Cluster[] = [];
  public politicas: Politica[] = [];
  public politicasOriginal: Politica[] = [];

  ngOnInit(): void {
    const hours: any = this.minDate.getHours();
    const minutes: any = this.minDate.getMinutes();

    const hoursAux: any = (hours < 10 ? "0" : "") + hours;
    const minutesAux: any = (minutes < 10 ? "0" : "") + minutes;

    this.parametroFG.controls['hora_vigencia'].setValue(hoursAux + ":" + minutesAux);

    this._loadingClusters();
    this._loadingPoliticas();

    if(!this.parametro || !this.parametro.id) {
      this.parametroFG.controls['politica'].disable();
    }

    this._parametro.getParametro().subscribe(parametro => {
      if(parametro) {
        this.parametro = parametro;

        if(this.parametro.id) {
          this.parametroFG.controls['nome'].setValue(this.parametro.nome);
          this.parametroFG.controls['descricao'].setValue(this.parametro.descricao);
          this.parametroFG.controls['modo'].setValue(this.parametro.modo);
          this.parametroFG.controls['cluster'].setValue(this.parametro.politica?.cluster);
          this.parametroFG.controls['politica'].setValue(this.parametro.politica);

          if(this.parametro.data_hora_vigencia) {
            const dataVigencia: Date = new Date(this.parametro.data_hora_vigencia);
            const hours: any = dataVigencia.getHours();
            const minutes: any = dataVigencia.getMinutes();
  
            const hoursAux: any = (hours < 10 ? "0" : "") + hours;
            const minutesAux: any = (minutes < 10 ? "0" : "") + minutes;
  
            this.parametroFG.controls['data_vigencia'].setValue(dataVigencia);
            this.parametroFG.controls['hora_vigencia'].setValue(hoursAux + ":" + minutesAux);
          }
        }
      }
    });

    this._parametro.getIsEditavel().subscribe(isEditavel => {
      this.parametroIsEditavel = isEditavel;

      if(!this.parametroIsEditavel) {
        this.parametroFG.controls['nome'].disable();
        this.parametroFG.controls['descricao'].disable();
        this.parametroFG.controls['modo'].disable();
        this.parametroFG.controls['data_vigencia'].disable();
        this.parametroFG.controls['hora_vigencia'].disable();
        this.parametroFG.controls['cluster'].disable();
        this.parametroFG.controls['politica'].disable();
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
          this.parametroFG.controls['politica'].enable();
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

  private _loadingParametroByID(id: string): void {
    this._http.get(api.private.parametro.getByID.replace("{PARAMETRO_ID}", id)).subscribe(
      (response: any) => {
        if(response) {
          const parametro: Parametro = response;
          this._parametro.setParametro(parametro);
        }
      }
    )
  }

  public onCreate(): Observable<boolean> {
    const subject = new BehaviorSubject(false);

    const data_vigencia: Date = this.parametroFG.value['data_vigencia'];
    const hora_vigencia: any = this.parametroFG.value['hora_vigencia'];

    let data_vigencia_aux: string = data_vigencia.toISOString();

    if(data_vigencia_aux?.length >= 10) { data_vigencia_aux = data_vigencia_aux.substring(0, 10); }

    const body: any = {
      nome: this.parametroFG.value['nome'],
      descricao: this.parametroFG.value['descricao'],
      modo: this.parametroFG.value['modo'],
      data_hora_vigencia: data_vigencia_aux + " " + hora_vigencia + ":00",
      versao: "1.0",
      politica_id: this.parametroFG.value['politica']?.id
    };

    this._http.post(api.private.parametro.post, body).subscribe(
      (response: any) => {
        if(response?.message) {
          this._snackbar.showSnackbarMessages({ message: response.message, type: 'success', has_duration: true });

          if(response.id) { this._loadingParametroByID(response.id); }
          
          subject.next(true);
        }
      },
      err => {
        if(err?.error?.error) {
          this.showErros({ error: err.error.error, campos_error: err.error.campos_error || [] });
        }

        subject.next(false);
      }
    )
    
    return subject.asObservable();
  }

  public onUpdate(): Observable<boolean> {
    const subject = new BehaviorSubject(false);

    const data_vigencia: Date = this.parametroFG.value['data_vigencia'];
    const hora_vigencia: any = this.parametroFG.value['hora_vigencia'];

    let data_vigencia_aux: string = data_vigencia.toISOString();

    if(data_vigencia_aux?.length >= 10) { data_vigencia_aux = data_vigencia_aux.substring(0, 10); }

    const body: any = {
      nome: this.parametroFG.value['nome'],
      descricao: this.parametroFG.value['descricao'],
      modo: this.parametroFG.value['modo'],
      data_hora_vigencia: data_vigencia_aux + " " + hora_vigencia + ":00",
      versao: "1.0",
      politica_id: this.parametroFG.value['politica']?.id
    };

    this._http.put(api.private.parametro.put.replace("{PARAMETRO_ID}", this.parametro.id), body).subscribe(
      (response: any) => {
        if(response?.message) {
          this._snackbar.showSnackbarMessages({ message: response.message, type: 'success', has_duration: true });

          if(this.parametro.id) { this._loadingParametroByID(this.parametro.id); }
          
          subject.next(true);
        }
      },
      err => {
        if(err?.error?.error) {
          this.showErros({ error: err.error.error, campos_error: err.error.campos_error || [] });
        }

        subject.next(false);
      }
    )
    
    return subject.asObservable();
  }

  public showErros(e: { error: string, campos_error: string[] }): void {
    this._snackbar.showSnackbarMessages({ message: e.error, type: 'error', has_duration: true });

    if(e.campos_error.length > 0) {
      if(e.campos_error.includes("nome")) {
        this.parametroFG.controls['nome'].markAsDirty();
        this.parametroFG.controls['nome'].markAsTouched();
        this.parametroFG.controls['nome'].setErrors({ nomeExistente: true });
      }
    }
  }

  public compareObjects(o1: any, o2: any): boolean { return o1?.id === o2?.id; }
}
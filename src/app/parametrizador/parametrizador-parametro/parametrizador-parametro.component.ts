import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Cluster, Politica } from '../parametrizador.interface';
import { clusters, politicas } from '../parametrizador.mockup';
import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr)


@Component({
  selector: 'app-parametrizador-parametro',
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
  templateUrl: './parametrizador-parametro.component.html',
  styleUrl: './parametrizador-parametro.component.scss',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt' },
    provideMomentDateAdapter(),
  ]
})
export class ParametrizadorParametroComponent implements OnInit {
  constructor() {}

  public minDate: Date = new Date();
  
  public parametroFG: FormGroup = new FormGroup({
    nome: new FormControl(null, [Validators.required, Validators.pattern("[A-Za-z0-9_]+")]),
    descricao: new FormControl(null, [Validators.required, Validators.maxLength(300)]),
    modo: new FormControl(null, [Validators.required]),
    dataVigencia: new FormControl(this.minDate, [Validators.required]),
    horaVigencia: new FormControl(this.minDate, [Validators.required]),
    cluster: new FormControl(null, [Validators.required]),
    politica: new FormControl(null, [Validators.required])
  });
  
  public clusters: Cluster[] = clusters.filter(c => c.isAtivo == true);
  public politicas: Politica[] = politicas.filter(p => p.isAtivo == true);

  ngOnInit(): void {
    this.parametroFG.controls['politica'].disable();
  }

  public onChangeCluster(event$: any): void {
    this.parametroFG.controls['politica'].setValue(null);

    if(event$ && event$.value && event$.value.id) {
      this.politicas = politicas.filter(p => p.isAtivo == true && p.cluster.id == event$.value.id);
      this.parametroFG.controls['politica'].enable();
    }
    else {
      this.parametroFG.controls['politica'].disable();
    }    
  }

  public compareObjects(o1: any, o2: any): boolean {
    return o1?.id === o2?.id;
  }
}

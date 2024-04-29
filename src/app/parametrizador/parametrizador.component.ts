import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper'
import { ParametrizadorParametroComponent } from './parametrizador-parametro/parametrizador-parametro.component';
import { ParametrizadorVariaveisComponent } from './parametrizador-variaveis/parametrizador-variaveis.component';
import { ParametrizadorDadosComponent } from './parametrizador-dados/parametrizador-dados.component';
import { ParametrizadorRevisaoComponent } from './parametrizador-revisao/parametrizador-revisao.component';
import { CommonModule } from '@angular/common';
import { ParametrizadorService } from './parametrizador.service';
import { Parametrizador } from '../../shared/interfaces/parametrizador.interface';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

export interface SASAuth {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  jti: string;
}

@Component({
  selector: 'app-parametrizador',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatStepperModule,
    ParametrizadorParametroComponent,
    ParametrizadorVariaveisComponent,
    ParametrizadorDadosComponent,
    ParametrizadorRevisaoComponent
  ],
  templateUrl: './parametrizador.component.html',
  styleUrl: './parametrizador.component.scss'
})
export class ParametrizadorComponent implements OnInit {
  @ViewChild("parametrizadorParametro") public parametrizadorParametro!: ParametrizadorParametroComponent;
  @ViewChild("parametrizadorVariaveis") public parametrizadorVariaveis!: ParametrizadorVariaveisComponent;
  @ViewChild("parametrizadorDados") public parametrizadorDados!: ParametrizadorDadosComponent;
  @ViewChild("parametrizadorRevisao") public parametrizadorRevisao!: ParametrizadorRevisaoComponent;

  constructor() { }

  private _http = inject(HttpClient);
  private _parametrizador = inject(ParametrizadorService);
  public parametrizador: Parametrizador = { id: 1, parametro: null, variaveis: [], dados: [] };

  public parametroStepperFG: FormGroup = new FormGroup({});
  public variaveisStepperFG: FormGroup = new FormGroup({});
  public dadosStepperFG: FormGroup = new FormGroup({});
  public revisaoStepperFG: FormGroup = new FormGroup({});

  public selectedIndex: number = 0;

  ngOnInit(): void {
    this._parametrizador.getParametrizador().subscribe( parametrizador => {
      if(parametrizador) { this.parametrizador = parametrizador; }
    });

    this._parametrizador.setParametrizador(this.parametrizador);

    // this.initAuthSAS();
    // this.initAPILocal();
  }

  public initAPILocal(): void{
    this._http.get("http://127.0.0.1:5000/api-sas", { }).subscribe(
      response => { console.log(response); },
      error => { console.log(error); }
    )
  }

  public initAuthSAS(): void {
    const url: string = "https://rmdemo.unx.sas.com/SASLogon/oauth/token";
    const username: string = "sas.ec";
    const password: string = "";
    const authorizationData = 'Basic ' + btoa(username + ':' + password);
    const body: any = { "username": "demo66", "password": "Go4thsas", "grant_type": "password" };
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization': authorizationData
    });

    this._http.post(url, body, { headers: headers }).subscribe(
      response => { console.log(response); },
      error => { console.log(error); }
    )
  }

  public onStepperChange(index$: number): void {
    this.selectedIndex = index$;
  }

  public disabledNextButton(): boolean {
    if(this.selectedIndex == 0 && this.parametrizadorParametro) { return this.parametrizadorParametro.parametroFG.valid; }
    else if(this.selectedIndex == 1 && this.parametrizadorVariaveis) { return this.parametrizadorVariaveis.variaveisStepperIsValid(); }
    else if(this.selectedIndex == 2) { return true; }
    else { return true; }
  }

  public onNextButton(): void {
    if(this.selectedIndex == 0 && this.parametrizadorParametro && this.parametrizadorParametro.parametroFG.valid) {
      this.parametrizador.parametro = {
        id: 1,
        nome: this.parametrizadorParametro.parametroFG.value['nome'],
        descricao: this.parametrizadorParametro.parametroFG.value['descricao'],
        modo: this.parametrizadorParametro.parametroFG.value['modo'],
        dataVigencia: this.parametrizadorParametro.parametroFG.value['dataVigencia'],
        horaVigencia: this.parametrizadorParametro.parametroFG.value['horaVigencia'],
        cluster: this.parametrizadorParametro.parametroFG.value['cluster'],
        politica: this.parametrizadorParametro.parametroFG.value['politica'],
      };

      this._parametrizador.setParametrizador(this.parametrizador);
      this.selectedIndex = 1;
    }
    else if(this.selectedIndex == 1 && this.parametrizadorVariaveis && this.parametrizadorVariaveis.variaveisStepperIsValid()) {
      this.parametrizador.variaveis = [];

      this.parametrizadorVariaveis.data.map(variavel => {
        this.parametrizador.variaveis.push(variavel);
      })

      this._parametrizador.setParametrizador(this.parametrizador);
      this.selectedIndex = 2;
    }
    else if(this.selectedIndex == 2 && this.dadosStepperFG.valid) {
      this.selectedIndex = 3;
    }
    else {
      console.log("End!!!");
    }
  }
}

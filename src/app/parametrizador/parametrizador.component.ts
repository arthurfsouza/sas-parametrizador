import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper'
import { ParametrizadorDadosComponent } from './parametrizador-dados/parametrizador-dados.component';
import { ParametrizadorRevisaoComponent } from './parametrizador-revisao/parametrizador-revisao.component';
import { MenuNavigatorComponent } from '../../shared/components/menu-navigator/menu-navigator.component';
import { ParametrizadorService } from './parametrizador.service';
import { ActivatedRoute } from '@angular/router';

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
    ParametrizadorDadosComponent,
    ParametrizadorRevisaoComponent,
    MenuNavigatorComponent
  ],
  templateUrl: './parametrizador.component.html',
  styleUrl: './parametrizador.component.scss'
})
export class ParametrizadorComponent implements OnInit {
  @ViewChild("parametrizadorDados") public parametrizadorDados!: ParametrizadorDadosComponent;
  @ViewChild("parametrizadorRevisao") public parametrizadorRevisao!: ParametrizadorRevisaoComponent;

  constructor(private _activated: ActivatedRoute) { }

  private _http = inject(HttpClient);
  private _parametrizador = inject(ParametrizadorService);
  public parametrizador: any = { id: 1, parametro: null, variaveis: [], dados: [] }; // Parametrizador

  public parametroStepperFG: FormGroup = new FormGroup({});
  public variaveisStepperFG: FormGroup = new FormGroup({});
  public dadosStepperFG: FormGroup = new FormGroup({});
  public revisaoStepperFG: FormGroup = new FormGroup({});

  public selectedIndex: number = 0;
  public parametrizadorID: any;

  ngOnInit(): void {
    this._parametrizador.getParametrizador().subscribe( parametrizador => {
      if(parametrizador) { this.parametrizador = parametrizador; }
    });

    this._parametrizador.setParametrizador(this.parametrizador);

    this._activated.params.subscribe(params => {
      console.log(params);
      if(params['parametrizadorID']) {
        this.parametrizadorID = params['parametrizadorID'];
        const parametrizador: any = null; // Parametrizador

        if(parametrizador) { this._parametrizador.setParametrizador(parametrizador); }
      }
    });

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
    if(this.selectedIndex == 2) { return true; }
    else { return true; }
  }

  public onNextButton(): void {
    if(this.selectedIndex == 2 && this.parametrizadorDados && this.parametrizadorDados.dadosFG.valid) {
      this.parametrizador.dados = this.parametrizadorDados.getDados() || [];
      this._parametrizador.setParametrizador(this.parametrizador);
      this.selectedIndex = 3;
    }
    else {
      console.log("End!!!");
    }
  }
}

import { Component, ViewChild, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MenuNavigatorComponent } from '../../../shared/components';
import { DadosComponent } from './dados/dados.component';
import { ParametroComponent } from './parametro/parametro.component';
import { RevisaoComponent } from './revisao/revisao.component';
import { VariaveisComponent } from './variaveis/variaveis.component';
import { ParametroService } from '../../../shared/services';
import { Parametro } from '../../../shared/interfaces';
import { api } from '../../../shared/configurations';

@Component({
  selector: 'app-parametro-form',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    ParametroComponent,
    VariaveisComponent,
    DadosComponent,
    RevisaoComponent,
    MenuNavigatorComponent
  ],
  templateUrl: './parametro-form.component.html',
  styleUrl: './parametro-form.component.scss'
})
export class ParametroFormComponent {
  @ViewChild("appParametro") public appParametro!: ParametroComponent;
  @ViewChild("appVariaveis") public appVariaveis!: VariaveisComponent;
  @ViewChild("appDados") public appDados!: DadosComponent;
  @ViewChild("appRevisao") public appRevisao!: RevisaoComponent;

  private _http = inject(HttpClient);
  private _parametro = inject(ParametroService);

  constructor(private _activated: ActivatedRoute) { }

  public parametroStepperFG: FormGroup = new FormGroup({});
  public variaveisStepperFG: FormGroup = new FormGroup({});
  public dadosStepperFG: FormGroup = new FormGroup({});
  public revisaoStepperFG: FormGroup = new FormGroup({});

  public parametro!: Parametro;
  public parametroID!: string;

  public selectedIndex: number = 0;

  ngOnInit(): void {
    this._parametro.getParametro().subscribe(parametro => {
      if(parametro) { this.parametro = parametro; }
    });

    // this._parametro.setParametro(this.parametro);

    this._activated.params.subscribe(params => {
      if(params['parametroID']) {
        this.parametroID = params['parametroID'];

        this._loadingParametro();
      }
    });
  }

  private _loadingParametro(): void {
    if(this.parametroID) {
      this._http.get(api.private.parametro.getByID.replace("{PARAMETRO_ID}", this.parametroID)).subscribe(
        response => {
          console.log(response);
          // this._parametro.setParametro(this.parametro);
        }
      )
    }
    
  }

  public onStepperChange(index$: number): void { this.selectedIndex = index$; }

  public disabledNextButton(): boolean {
    if(this.selectedIndex == 0 && this.appParametro) { return this.appParametro.parametroFG.valid; }
    // else if(this.selectedIndex == 1 && this.appVariaveis) { return this.appVariaveis.variaveisStepperIsValid(); }
    // else if(this.selectedIndex == 2) { return true; }
    else { return true; }
  }

  public onNextButton(): void {
    if(this.selectedIndex == 0 && this.appParametro && this.appParametro.parametroFG.valid) {
      // this.parametrizador.parametro = {
      //   id: 1,
      //   nome: this.parametrizadorParametro.parametroFG.value['nome'],
      //   descricao: this.parametrizadorParametro.parametroFG.value['descricao'],
      //   modo: this.parametrizadorParametro.parametroFG.value['modo'],
      //   dataVigencia: this.parametrizadorParametro.parametroFG.value['dataVigencia'],
      //   horaVigencia: this.parametrizadorParametro.parametroFG.value['horaVigencia'],
      //   cluster: this.parametrizadorParametro.parametroFG.value['cluster'],
      //   politica: this.parametrizadorParametro.parametroFG.value['politica'],
      // };

      // this._parametrizador.setParametrizador(this.parametrizador);
      // this.selectedIndex = 1;
    }
    // else if(this.selectedIndex == 1 && this.parametrizadorVariaveis && this.parametrizadorVariaveis.variaveisStepperIsValid()) {
    //   this.parametrizador.variaveis = [];

    //   this.parametrizadorVariaveis.data.map(variavel => {
    //     this.parametrizador.variaveis.push(variavel);
    //   })

    //   this._parametrizador.setParametrizador(this.parametrizador);
    //   this.selectedIndex = 2;
    // }
    // else if(this.selectedIndex == 2 && this.parametrizadorDados && this.parametrizadorDados.dadosFG.valid) {
    //   this.parametrizador.dados = this.parametrizadorDados.getDados() || [];
    //   this._parametrizador.setParametrizador(this.parametrizador);
    //   this.selectedIndex = 3;
    // }
    // else {
    //   console.log("End!!!");
    // }
  }
}

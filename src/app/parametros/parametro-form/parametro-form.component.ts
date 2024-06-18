import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    CommonModule,
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
  public parametroIsEditavel: boolean = true;

  public selectedIndex: number = 0;

  ngOnInit(): void {
    this._parametro.getParametro().subscribe(parametro => {
      if(parametro) { this.parametro = parametro; }
    });

    this._parametro.getIsEditavel().subscribe(isEditavel => { this.parametroIsEditavel = isEditavel; });

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
        (response: any) => {
          if(response && response.status_code) {
            const parametro: Parametro = response;
            this._parametro.setParametro(parametro);

            if(!["001", "002"].includes(response.status_code)) { this._parametro.setIsEditavel(false); }
          }
        }
      )
    }
    
  }

  public onStepperChange(index$: number): void { this.selectedIndex = index$; }

  public parametroCompleted(): boolean {  
    if(!this.parametroIsEditavel) { return true; }

    if(this.appParametro) { return this.appParametro.parametroFG.valid; }   
   
    return false;
  }

  public variaveisCompleted(): boolean {
    if(!this.parametroIsEditavel) { return true; }

    if(this.appVariaveis) { return this.appVariaveis.variaveisStepperIsValid(); }
   
    return false;
  }

  public dadosCompleted(): boolean {
    if(!this.parametroIsEditavel) { return true; }
    
    if(this.appDados) { return this.appDados.dadosFG.valid; }
   
    return false;
  }

  public disabledNextButton(): boolean {
    if(this.selectedIndex == 0) { return this.parametroCompleted(); }
    else if(this.selectedIndex == 1) { return this.variaveisCompleted(); }
    else if(this.selectedIndex == 2) { return this.dadosCompleted(); }
    else { return true; }
  }

  public onNextButton(): void {
    if(this.selectedIndex == 0 && this.parametroCompleted()) {
      let hasParametro: boolean = false;

      if(this.parametroID || this.parametro?.id) { hasParametro = true; }
      
      if(this.parametroIsEditavel) {
        if(!hasParametro) {
          this.appParametro.onCreate().subscribe(result => {
            if(result == true) { this.selectedIndex = 1; }
          });
        }
        else {
          this.appParametro.onUpdate().subscribe(result => {
            if(result == true) { this.selectedIndex = 1; }
          });
        }
      }
      else { this.selectedIndex = 1; }
    }
    else if(this.selectedIndex == 1 && this.variaveisCompleted()) {
      if(this.parametroIsEditavel) {
        this.appVariaveis.onCreate().subscribe(result => {
          if(result == true) { this.selectedIndex = 2; }
        });
      }
      else { this.selectedIndex = 2; }      
    }
    else if(this.selectedIndex == 2 && this.dadosCompleted()) {
      if(this.parametroIsEditavel) {
        this.appDados.onCreate().subscribe(result => {
          if(result == true) { this.selectedIndex = 3; }
        });
      }
      else { this.selectedIndex = 3; }      
    }
  }
}

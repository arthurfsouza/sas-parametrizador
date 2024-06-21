import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MenuNavigatorComponent } from '../../../shared/components';
import { DadosComponent } from './dados/dados.component';
import { ParametroComponent } from './parametro/parametro.component';
import { RevisaoComponent } from './revisao/revisao.component';
import { VariaveisComponent } from './variaveis/variaveis.component';
import { ParametroService } from '../../../shared/services';
import { Parametro } from '../../../shared/interfaces';
import { api, general } from '../../../shared/configurations';

@Component({
  selector: 'app-parametro-form',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
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

  public parametroStepperFG!: FormGroup;
  public variaveisStepperFG!: FormGroup;
  public dadosStepperFG!: FormGroup;
  public revisaoStepperFG!: FormGroup;

  constructor(private _router: Router, private _activated: ActivatedRoute) {
    this.parametroStepperFG = new FormGroup({ completed: new FormControl(null, [Validators.required]) });
    this.variaveisStepperFG = new FormGroup({ completed: new FormControl(null, [Validators.required]) });
    this.dadosStepperFG = new FormGroup({ completed: new FormControl(null, [Validators.required]) });
    this.revisaoStepperFG = new FormGroup({ });
  }

  public parametro!: Parametro;
  public parametroID!: string;
  public parametroIsEditavel: boolean = true;

  public selectedIndex: number = 0;

  ngOnInit(): void {
    this._parametro.getParametro().subscribe(parametro => {
      if(parametro) {
        this.parametro = parametro;
      
        if(this.parametro && this.parametro?.id) {
          this.parametroStepperFG.controls['completed'].setValue("Completed");
        }

        if(this.parametro?.variaveis && this.parametro?.variaveis?.length > 0) {
          this.variaveisStepperFG.controls['completed'].setValue("Completed");
        }

        if(this.parametro?.dados && this.parametro?.dados?.length > 0) {
          this.dadosStepperFG.controls['completed'].setValue("Completed");
        }
      }
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
    
    if(this.appDados) { return this.appDados.dadosStepperIsValid(); }
   
    return false;
  }

  public disabledNextButton(): boolean {
    if(this.selectedIndex == 0) { return this.parametroCompleted(); }
    else if(this.selectedIndex == 1) { return this.variaveisCompleted(); }
    else if(this.selectedIndex == 2) { return this.dadosCompleted(); }
    else { return true; }
  }

  public onBackButton(): void {
    if(this.selectedIndex > 0) { this.selectedIndex = (this.selectedIndex - 1); }
  }

  public onCancel(): void { this._router.navigate([general.routes.private.parametros]); }

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

  ngOnDestroy(): void {
    this._parametro.setParametro(null);
    this.parametroIsEditavel = true;
    this.selectedIndex = 0;

    this.parametroStepperFG.controls['completed'].setValue(null);
    this.variaveisStepperFG.controls['completed'].setValue(null);
    this.dadosStepperFG.controls['completed'].setValue(null);
  }
}
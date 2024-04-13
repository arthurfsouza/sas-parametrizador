import { Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper'
import { ParametrizadorParametroComponent } from './parametrizador-parametro/parametrizador-parametro.component';
import { ParametrizadorVariaveisComponent } from './parametrizador-variaveis/parametrizador-variaveis.component';
import { ParametrizadorDadosComponent } from './parametrizador-dados/parametrizador-dados.component';
import { ParametrizadorRevisaoComponent } from './parametrizador-revisao/parametrizador-revisao.component';
import { CommonModule } from '@angular/common';

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
export class ParametrizadorComponent {
  @ViewChild("parametrizadorParametro") public parametrizadorParametro!: ParametrizadorParametroComponent;
  @ViewChild("parametrizadorVariaveis") public parametrizadorVariaveis!: ParametrizadorVariaveisComponent;
  @ViewChild("parametrizadorDados") public parametrizadorDados!: ParametrizadorDadosComponent;
  @ViewChild("parametrizadorRevisao") public parametrizadorRevisao!: ParametrizadorRevisaoComponent;

  public parametroStepperFG: FormGroup = new FormGroup({});
  public variaveisStepperFG: FormGroup = new FormGroup({});
  public dadosStepperFG: FormGroup = new FormGroup({});
  public revisaoStepperFG: FormGroup = new FormGroup({});

  public selectedIndex: number = 1;
  public stepperTitles: string[] = ["Cadastro de Parâmetro", "Cadastro de Variável"]

  public onStepperChange(index$: number): void {
    this.selectedIndex = index$;
  }

  public disabledNextButton(): boolean {
    if(this.selectedIndex == 0 && this.parametrizadorParametro) { return this.parametrizadorParametro.parametroFG.valid; }
    else if(this.selectedIndex == 1 && this.parametrizadorVariaveis) { return true; }
    else if(this.selectedIndex == 2) { return true; }
    else { return true; }
  }

  public onNextButton(): void {
    if(this.selectedIndex == 0 && this.parametrizadorParametro && this.parametrizadorParametro.parametroFG.valid) {
      this.selectedIndex = 1;
    }
    else if(this.selectedIndex == 1 && this.variaveisStepperFG.valid) {
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

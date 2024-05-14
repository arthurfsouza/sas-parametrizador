import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Parametrizador, Variavel, VariavelLista } from '../../../shared/interfaces/parametrizador.interface';
import { DigitOnlyDirective } from '../../../shared/directives/digit-only.directive';
import { ParametrizadorService } from '../parametrizador.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

// export const variaveisMockup: Variavel[] = [
//   { id: 1, isChave: true, nome: "Var1", descricao: "Descrição 1", tamanho: 6, qtdCasasDecimais: 2, tipo: 'DECIMAL', lista: null },
//   { id: 2, isChave: false, nome: "Var2", descricao: "Descrição 2", tamanho: 9, qtdCasasDecimais: null, tipo: 'NUMERICO', lista: null },
//   { id: 3, isChave: false, nome: "Var3", descricao: "Descrição 3", tamanho: 15, qtdCasasDecimais: null, tipo: 'TEXTO', lista: null },
//   { id: 4, isChave: false, nome: "Var4", descricao: "Descrição 4", tamanho: 3, qtdCasasDecimais: null, tipo: 'LISTA', lista: [
//     { id: 1, nome: "Opção A", checked: true },
//     { id: 2, nome: "Opção B", checked: false },
//     { id: 3, nome: "Opção C", checked: true },
//     { id: 4, nome: "Opção D", checked: false },
//     { id: 5, nome: "Opção E", checked: true },
//     { id: 6, nome: "Opção F", checked: false },
//     { id: 7, nome: "Opção G", checked: true },
//     { id: 8, nome: "Opção H", checked: false },
//     { id: 9, nome: "Opção I", checked: true },
//     { id: 10, nome: "Opção J", checked: false }]
//   }
// ];

@Component({
  selector: 'app-parametrizador-dados',
  standalone: true,
  imports: [
    CommonModule,
    DigitOnlyDirective,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './parametrizador-dados.component.html',
  styleUrl: './parametrizador-dados.component.scss'
})
export class ParametrizadorDadosComponent {
  constructor(public dialog: MatDialog, private _fb: FormBuilder){ }

  private _parametrizador = inject(ParametrizadorService);
  public parametrizador!: Parametrizador;

  public displayedColumns: string[] = [];
  public variaveis: Variavel[] = [];

  public dadosFG: FormGroup = new FormGroup({
    dados: this._fb.array([])
  });
  private _dados: FormArray = <FormArray>this.dadosFG.get('dados');  

  ngOnInit(): void {
    this._parametrizador.getParametrizador().subscribe(parametrizador => {
      if(parametrizador) {
        this.parametrizador = parametrizador;

        if(this.parametrizador.variaveis && this.parametrizador.variaveis.length > 0) {
          this.variaveis = this.parametrizador.variaveis;
          
          this.initDados();
        }
      }
    });
  }

  public initDados(): void {
    for(let varAux of this.parametrizador.variaveis) { this.displayedColumns.push("dado-control-" + varAux.id); }

    this.displayedColumns.push("dado-control-actions");      
    this._patchDado(1);
  }

  public getColumnID(column: string): any {
    return column.replace("dado-control-", "");
  }

  public getColumnName(column: string): string {
    const id: any = this.getColumnID(column);
    const variavel: Variavel | undefined = this.variaveis.find(v => v.id == id);

    return variavel ? variavel.nome : "-";
  }

  public getColumnVariable(column: string): Variavel | undefined {
    const id: any = this.getColumnID(column);
    const variavel: Variavel | undefined = this.variaveis.find(v => v.id == id);

    return variavel;
  }

  public getPattern(column: string): string | RegExp {
    const id: any = this.getColumnID(column);
    const variavel: Variavel | undefined = this.variaveis.find(v => v.id == id);
    let pattern: string | RegExp = "";

    if(variavel) {
      if(variavel.tipo == "DECIMAL") {
        pattern = new RegExp("^[0-9]{1," + variavel.tamanho + "}.[0-9]{1," + variavel.qtdCasasDecimais + "}$");
      }
      else if(variavel.tipo == "NUMERICO") {
        pattern = new RegExp("^[0-9]{1," + variavel.tamanho + "}$");
      }
    }

    return pattern;    
  }

  public getListItems(column: string): VariavelLista[] {
    const id: any = this.getColumnID(column);
    const variavel: Variavel | undefined = this.variaveis.find(v => v.id == id);
    const variavelLista: VariavelLista[] = variavel ? variavel.lista?.filter(l => l.checked == true) || [] : [];

    return variavelLista;
  }

  public getDados(): any[] {
    return this._dados.value || [];
  }

  public onAddLine(): void {
    const dados: any[] = this._dados.value || [];
    const nextID: number = dados.reduce((max, dado) => (dado['dado-control-id'] > max ? dado['dado-control-id'] : max), 0) + 1;

    this._patchDado(nextID);
  }

  public onDeleteLine(dadoFG: any): void {
    const dados: any[] = this._dados.value || [];
    const dadoAux: any = dadoFG.value;
    let index = 0;

    for(let i = 0; i < dados.length; i++) {
      if(dados[i]['dado-control-id'] === dadoAux['dado-control-id']) {
        index = i;
        break;
      }
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      height: '300px',
      data: {
        title: "Aviso de Exclusão de linha",
        description: `<p>Esta ação não poderá ser desfeita.</p><p>Tem certeza que deseja excluir a linha selecionada?</p>`,
        descriptionType: "HTML",
        buttonText: "Excluir"
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result == "delete") {
        dados.splice(index, 1);

        let formArray: FormArray = <FormArray>this.dadosFG.get('dados');

        while(formArray.length !== 0) { formArray.removeAt(0); }

        dados.map(dado => {
          this._patchDado(dado["dado-control-id"], dado);
        });
      }
    });
  }

  private _patchDado(id: number, value?: any): void {
    this._dados.push(this._patchDadoFG(id, value));
  }

  private _patchDadoFG(id: number, value?: any): FormGroup {
    let fg: FormGroup = this._fb.group({
      "dado-control-id": new FormControl(id, [Validators.required])
    });

    for(let varAux of this.variaveis) {
      fg.addControl(
        "dado-control-" + varAux.id,
        new FormControl(value ? value["dado-control-" + varAux.id] : null, [Validators.required])
      );
    }

    return fg;
  }

  public dados(): AbstractControl[] {
    let formGroup: any = this.dadosFG.get('dados');
    
    return formGroup.controls;
  }
}
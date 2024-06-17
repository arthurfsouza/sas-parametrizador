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
import { ConfirmDialogComponent } from '../../../../shared/components';
import { ParametroService, SnackbarMessagesService } from '../../../../shared/services';
import { DigitOnlyDirective } from '../../../../shared/directives';
import { Parametro, Variavel, VariavelLista } from '../../../../shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { api } from '../../../../shared/configurations';

@Component({
  selector: 'app-dados',
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
  templateUrl: './dados.component.html',
  styleUrl: './dados.component.scss'
})
export class DadosComponent {
  private _http = inject(HttpClient);
  private _snackbar = inject(SnackbarMessagesService);
  private _parametro = inject(ParametroService);

  constructor(public dialog: MatDialog, private _fb: FormBuilder){ }
  
  public parametro!: Parametro;

  public displayedColumns: string[] = [];
  public variaveis: Variavel[] = [];

  public dadosFG: FormGroup = new FormGroup({ dados: this._fb.array([]) });
  private _dados: FormArray = <FormArray>this.dadosFG.get('dados');

  ngOnInit(): void {
    this._parametro.getParametro().subscribe(parametro => {
      if(parametro) {
        this.parametro = parametro;

        if(this.parametro.variaveis && this.parametro.variaveis.length > 0) {
          this.variaveis = this.parametro.variaveis;
          
          this.initDados();
        }
      }
    });
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
    const dados: any[] = [];

    console.log("DadosFG: ", this.dadosFG.controls['dados'].value);
    console.log("Dados FormArray: ", this._dados.value);
    console.log("Dados [Abastract Control]: ", this.dados());

    // this._http.post(api.private.parametro.dado.post.replace("{PARAMETRO_ID}", this.parametro.id), dados).subscribe(
    //   (response: any) => {
    //     if(response?.message) {
    //       this._snackbar.showSnackbarMessages({ message: response.message, type: 'success', has_duration: true });

    //       if(this.parametro.id) { this._loadingParametroByID(this.parametro.id); }

    //       subject.next(true);
    //     }
    //   },
    //   err => {
    //     if(err?.error?.error) {
    //       this.showErros({ error: err.error.error, campos_error: err.error.campos_error || [] });
    //     }

    //     subject.next(false);
    //   }
    // );
    
    return subject.asObservable();
  }

  public initDados(): void {
    this.displayedColumns = [];

    if(this.parametro.variaveis && this.parametro.variaveis.length > 0) {
      for(let varAux of this.parametro.variaveis) { this.displayedColumns.push("dado-control-" + varAux.id); }
    }

    this.displayedColumns.push("dado-control-actions");      
    this._patchDado(1);
  }

  public getColumnID(column: string): any { return column.replace("dado-control-", ""); }

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
        pattern = new RegExp("^[0-9]{1," + variavel.tamanho + "}.[0-9]{1," + variavel.qtd_casas_decimais + "}$");
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
    const variavelLista: VariavelLista[] = variavel ? variavel.variaveis_lista?.filter((l: any) => l.checked == true) || [] : [];

    return variavelLista;
  }

  public getDados(): any[] { return this._dados.value || []; }

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
    let fg: FormGroup = this._fb.group({ "dado-control-id": new FormControl(id, [Validators.required]) });

    for(let varAux of this.variaveis) {
      fg.addControl(
        "dado-control-" + varAux.id,
        new FormControl(value ? value["dado-control-" + varAux.id] : null, [Validators.required])
      );
    }

    return fg;
  }

  public showErros(e: { error: string, campos_error: string[] }): void {
    this._snackbar.showSnackbarMessages({ message: e.error, type: 'error', has_duration: true });
  }

  public dados(): AbstractControl[] {
    let formGroup: any = this.dadosFG.get('dados');
    
    return formGroup.controls;
  }
}
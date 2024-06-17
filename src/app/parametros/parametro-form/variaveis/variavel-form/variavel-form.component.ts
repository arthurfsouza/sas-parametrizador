import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ParametroService } from '../../../../../shared/services';
import { Parametro, Variavel, VariavelLista, VariavelTipo } from '../../../../../shared/interfaces';
import { variaveisTipo } from '../../../../../shared/mockups';

import StringUtils from '../../../../../shared/utils/string/string.utils';

@Component({
  selector: 'app-variavel-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './variavel-form.component.html',
  styleUrl: './variavel-form.component.scss'
})
export class VariavelFormComponent {
  private _parametro = inject(ParametroService);

  constructor(
    public dialogRef: MatDialogRef<VariavelFormComponent>, @Inject(MAT_DIALOG_DATA) public data: { variaveis: Variavel[]; variavel: Variavel }) {
      if(this.data && this.data.variaveis) { this.variaveis = this.data.variaveis; }

      if(this.data && this.data.variavel) {
        this._initValidators(this.data.variavel.tipo);

        this.variavelFG.controls['nome'].setValue(this.data.variavel.nome);
        this.variavelFG.controls['tipo'].setValue(this.tipos.find(t => t.tipo == this.data.variavel.tipo));
        this.variavelFG.controls['descricao'].setValue(this.data.variavel.descricao);
        this.variavelFG.controls['tamanho'].setValue(this.data.variavel.tamanho);
        this.variavelFG.controls['qtd_casas_decimais'].setValue(this.data.variavel.qtd_casas_decimais);
        this.variavelFG.controls['is_chave'].setValue(this.data.variavel.is_chave);
        this.variavelFG.controls['variaveis_lista'].setValue(this.data.variavel.variaveis_lista);

        if(this.data.variavel.variaveis_lista && this.data.variavel.variaveis_lista.length > 0) {
          this.dataListas = this.data.variavel.variaveis_lista;
          this.dataSource = new MatTableDataSource(this.dataListas);
        }
      }

      this.variavelFG.controls['nome'].valueChanges.pipe(debounceTime(500)).subscribe(value => {
        this.variavelFG.controls['nome'].setErrors(null);

        if(value && this.variaveis.length > 0) {
          let variavel!: Variavel | undefined;

          if(this.data.variavel) { variavel = this.variaveis.find(v => v.nome == value && v.id != this.data.variavel.id);  }
          else { variavel = this.variaveis.find(v => v.nome == value) }
          
          if(variavel) {
            this.variavelFG.controls['nome'].markAsDirty();
            this.variavelFG.controls['nome'].markAsTouched();
            this.variavelFG.controls['nome'].setErrors({ nomeExistente: true });
          }
        }
      })
  }

  public parametro!: Parametro;

  public variavelFG: FormGroup = new FormGroup({
    nome: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.pattern("[A-Za-z0-9_]+")]),
    tipo: new FormControl(null, [Validators.required]),
    descricao: new FormControl(null, [Validators.required, Validators.maxLength(350)]),
    tamanho: new FormControl(null, [Validators.required]),
    qtd_casas_decimais: new FormControl(null),
    is_chave: new FormControl(true, [Validators.required]),
    variaveis_lista: new FormControl(null)
  });

  public listasFG: FormGroup = new FormGroup({ item: new FormControl(null, [Validators.required]) });

  public variaveis: Variavel[] = [];
  public tipos: { id: number; nome: string; tipo: VariavelTipo }[] = variaveisTipo;

  public displayedColumns: string[] = ["checkbox", "nome", "actions"];
  public dataSource: MatTableDataSource<VariavelLista> = new MatTableDataSource<VariavelLista>([]);
  public dataListas: VariavelLista[] = [];
  public itemID: string | null = null;

  ngOnInit(): void {
    this._parametro.getParametro().subscribe(parametro => {
      if(parametro) {
        this.parametro = parametro;
      }
    });
  }

  ngAfterViewInit(): void {
    if(this.parametro) {
      if(this.parametro.modo == "GLOBAL") { this.variavelFG.controls['is_chave'].setValue(false); }
    }
  }

  public onChangeTipo(event$: any): void {
    if(event$ && event$.value && event$.value.tipo) { this._initValidators(event$.value.tipo); }
  }

  public onChangeCheck(event$: any, item: VariavelLista): void {
    for(let vl of this.dataListas) {
      if(vl.id == item.id) {
        if(event$ && event$.checked == true) { vl.is_visivel = true; }
        else { vl.is_visivel = false; }
        
        break;
      }
    }
  }

  private _initValidators(tipo: VariavelTipo): void {
    this.variavelFG.controls['tamanho'].reset();

    this.variavelFG.controls['qtd_casas_decimais'].setValidators(null);
    this.variavelFG.controls['qtd_casas_decimais'].reset();

    this.variavelFG.controls['variaveis_lista'].setValidators(null);
    this.variavelFG.controls['variaveis_lista'].reset();
    
    this.listasFG.controls['item'].reset();      

    if(tipo == "DECIMAL") {
      this.variavelFG.controls['qtd_casas_decimais'].addValidators([Validators.required]);
      this.variavelFG.controls['qtd_casas_decimais'].updateValueAndValidity();
    }
    else if(tipo == "LISTA") {
      this.variavelFG.controls['variaveis_lista'].addValidators([Validators.required]);
      this.variavelFG.controls['variaveis_lista'].updateValueAndValidity();
    }
  }

  public onSaveItem(): void {
    if(this.listasFG.controls['item'].valid) {
      if(this.itemID) {
        for(let i = 0; i < this.dataListas.length; i++) {
          if(this.dataListas[i].id === this.itemID) {
            this.dataListas[i].nome = this.listasFG.controls['item'].value;
            break;
          }
        }
      }
      else {
        this.dataListas.push({
          id: StringUtils.uuidv4(),
          nome: this.listasFG.controls['item'].value,
          is_visivel: true
        });
      }

      this.dataSource = new MatTableDataSource(this.dataListas);
      this.variavelFG.controls['variaveis_lista'].setValue(this.dataListas);
      this.listasFG.controls['item'].reset();
      this.itemID = null;
    }
  }

  public onEditItem(item: VariavelLista): void {
    this.itemID = item.id;
    this.listasFG.controls['item'].setValue(item.nome);
  }

  public onDeleteItem(item: VariavelLista): void {
    let index = 0;

    for(let i = 0; i < this.dataListas.length; i++) {
      if(this.dataListas[i].id === item.id) {
        index = i;
        break;
      }
    }

    this.dataListas.splice(index, 1);

    this.dataSource = new MatTableDataSource(this.dataListas);
    this.variavelFG.controls['variaveis_lista'].setValue(this.dataListas);
  }

  public onSave(): void {
    if(this.variavelFG.valid) { this.dialogRef.close({ variavel: this.variavelFG.value }); }
  }

  public compareObjects(o1: any, o2: any): boolean { return o1?.id === o2?.id; }
}
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-parametrizador-variavel-form',
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
  templateUrl: './parametrizador-variavel-form.component.html',
  styleUrl: './parametrizador-variavel-form.component.scss'
})
export class ParametrizadorVariavelFormComponent {
  constructor(
    public dialogRef: MatDialogRef<ParametrizadorVariavelFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if(this.data && this.data.variavel) {
        this.initValidators(this.data.variavel.codigo);

        this.variavelFG.controls['nome'].setValue(this.data.variavel.nome);
        this.variavelFG.controls['tipo'].setValue(this.tipos.find(t => t.codigo == this.data.variavel.tipo));
        this.variavelFG.controls['descricao'].setValue(this.data.variavel.descricao);
        this.variavelFG.controls['tamanho'].setValue(this.data.variavel.tamanho);
        this.variavelFG.controls['qtdCasasDecimais'].setValue(this.data.variavel.qtdCasasDecimais);
        this.variavelFG.controls['isChave'].setValue(this.data.variavel.isChave);
        this.variavelFG.controls['lista'].setValue(this.data.variavel.lista);

        if(this.data.variavel.lista && this.data.variavel.lista.length > 0) {
          this.dataLista = this.data.variavel.lista;
          this.dataSource = new MatTableDataSource(this.dataLista);
        }
      }
  }

  public variavelFG: FormGroup = new FormGroup({
    nome: new FormControl(null, [Validators.required, Validators.pattern("[A-Za-z0-9_]+")]),
    tipo: new FormControl(null, [Validators.required]),
    descricao: new FormControl(null, [Validators.required, Validators.maxLength(60)]),
    tamanho: new FormControl(null, [Validators.required]),
    qtdCasasDecimais: new FormControl(null),
    isChave: new FormControl(true, [Validators.required]),
    lista: new FormControl(null)
  });

  public listaFG: FormGroup = new FormGroup({
    item: new FormControl(null, [Validators.required])
  })

  public tipos: any[] = [
    { id: 1, nome: "Decimal", codigo: "DECIMAL" },
    { id: 2, nome: "Numérico", codigo: "NUMERICO" },
    { id: 3, nome: "Lista", codigo: "LISTA" },
    { id: 4, nome: "Texto", codigo: "TEXTO" },
  ];

  public displayedColumns: string[] = ["checkbox", "nome", "actions"];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]); // VariavelLista
  public dataLista: any[] = []; // VariavelLista
  public itemID: number | null = null;

  public onChangeTipo(event$: any): void {
    if(event$ && event$.value && event$.value.codigo) {
      this.initValidators(event$.value.codigo);
    }
  }

  public onChangeCheck(event$: any, item: any): void { // VariavelLista
    for(let vl of this.dataLista) {
      if(vl.id == item.id) {
        if(event$ && event$.checked == true) { vl.checked = true; }
        else { vl.checked = false; }
        
        break;
      }
    }
  }

  public initValidators(code: string): void {
    const codigo: string = code;

    this.variavelFG.controls['tamanho'].reset();

    this.variavelFG.controls['qtdCasasDecimais'].setValidators(null);
    this.variavelFG.controls['qtdCasasDecimais'].reset();

    this.variavelFG.controls['lista'].setValidators(null);
    this.variavelFG.controls['lista'].reset();
    
    this.listaFG.controls['item'].reset();      

    if(codigo == "DECIMAL") {
      this.variavelFG.controls['qtdCasasDecimais'].addValidators([Validators.required]);
      this.variavelFG.controls['qtdCasasDecimais'].updateValueAndValidity();
    }
    else if(codigo == "LISTA") {
      this.variavelFG.controls['lista'].addValidators([Validators.required]);
      this.variavelFG.controls['lista'].updateValueAndValidity();
    }
  }

  public onSaveItem(): void {
    if(this.listaFG.controls['item'].valid) {
      if(this.itemID) {
        for(let i = 0; i < this.dataLista.length; i++) {
          if(this.dataLista[i].id === this.itemID) {
            this.dataLista[i].nome = this.listaFG.controls['item'].value;
            break;
          }
        }
      }
      else {
        const nextID: number = this.dataLista.reduce((max, lista) => (lista.id > max ? lista.id : max), 0) + 1;

        this.dataLista.push({
          id: nextID,
          nome: this.listaFG.controls['item'].value,
          checked: false
        });
      }

      this.dataSource = new MatTableDataSource(this.dataLista);
      this.variavelFG.controls['lista'].setValue(this.dataLista);
      this.listaFG.controls['item'].reset();
      this.itemID = null;
    }
  }

  public onEditItem(item: any): void { // VariavelLista
    this.itemID = item.id;
    this.listaFG.controls['item'].setValue(item.nome);
  }

  public onDeleteItem(item: any): void { // VariavelLista
    let index = 0;

    for(let i = 0; i < this.dataLista.length; i++) {
      if(this.dataLista[i].id === item.id) {
        index = i;
        break;
      }
    }

    this.dataLista.splice(index, 1);

    this.dataSource = new MatTableDataSource(this.dataLista);
    this.variavelFG.controls['lista'].setValue(this.dataLista);
  }

  public onSave(): void {
    if(this.variavelFG.valid) {
      this.dialogRef.close({ variavel: this.variavelFG.value }); 
    }
  }

  public compareObjects(o1: any, o2: any): boolean {  return o1?.id === o2?.id; }
}

import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CSVService, ParametroService } from '../../../../../shared/services';
import { Parametro, Variavel, VariavelUpload } from '../../../../../shared/interfaces';
import StringUtils from '../../../../../shared/utils/string/string.utils';

@Component({
  selector: 'app-variavel-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatExpansionModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  templateUrl: './variavel-upload.component.html',
  styleUrl: './variavel-upload.component.scss'
})
export class VariavelUploadComponent {
  private _csv = inject(CSVService);
  private _parametro = inject(ParametroService);

  constructor(public dialogRef: MatDialogRef<VariavelUploadComponent>) { }

  public parametro!: Parametro;

  public file1!: File | null;
  public importedData1: Array<any> = [];

  public displayedColumns1: string[] = ["nome", "tipo", "is_chave", "tamanho", "qtd_casas_decimais"];
  public dataSource1: MatTableDataSource<VariavelUpload> = new MatTableDataSource<VariavelUpload>([]);
  public data1: VariavelUpload[] = [];
  
  public data1Status: 'NONE' | 'INVALID' | 'VALID' | 'CURRENT' = 'NONE';
  public data1EmptyFlag: boolean = false;
  public data1MissingColumns: string[] = [];
  public data1DuplicateVariables: boolean = false;
  public data1MissingKeyVariable: boolean = false;
  
  public displayedColumns2: string[] = ["nome", "status", "file", "action"];
  public displayedColumns2Expand = [...this.displayedColumns2, 'expand'];
  public expandedElement: any;
  public dataSource2: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  public data2: any[] = [];

  ngOnInit(): void {
    this._parametro.getParametro().subscribe(parametro => {
      if(parametro) {
        this.parametro = parametro;

        if(this.parametro.variaveis && this.parametro.variaveis.length > 0) {
          const variaveis: any[] = [];
          const dataSource2: any[] = [];
          
          this.parametro.variaveis.map((variavel: Variavel) => {
            variaveis.push({
              nome: variavel.nome,
              descricao: variavel.descricao,
              is_chave: variavel.is_chave ? "true" : "false",
              tipo: variavel.tipo,
              tamanho: variavel.tamanho.toString(),
              qtd_casas_decimais: variavel.qtd_casas_decimais?.toString() || null,
            });

            if(variavel.tipo == 'LISTA') {
              let data: any[] = [];

              if(variavel && variavel.variaveis_lista && variavel.variaveis_lista.length > 0) {
                data = variavel.variaveis_lista.map((l: any) => { return {
                  variaveis_lista: { id: l.id, nome: l.nome, is_visivel: l.is_visivel },
                  controle: { nomeObrigatorio: false, isVisivelObrigatorio: false, isVisivelNaoBooleano: false }
                }});
              }

              dataSource2.push({
                nome: variavel.nome,
                file: null,
                importedData: [],
                data: data,
                dataEmptyFlag: false,
                dataMissingColumns: false,
                dataStatus: data.length > 0 ? "CURRENT" : "NONE"
              });
            }
          });

          this.initDataSource1(variaveis);
          this.data1Status = "CURRENT";

          this.dataSource2 = new MatTableDataSource(dataSource2);
        }
      }
    });
  }

  public onSaveVariaveis(): void {
    if(this.data1Status == "VALID") {
      this.file1 = null;
      this.importedData1 = [];
      this.data1Status = 'CURRENT';

      this.parametro.variaveis = this.data1.map(d => d.variavel);
      this._parametro.setParametro(this.parametro);
    }
  }

  public onSaveLista(row: any): void {
    if(row.dataStatus == "VALID") {
      row.file = null;
      row.importedData = [];
      row.dataStatus = 'CURRENT';

      if(this.parametro.variaveis && this.parametro.variaveis.length > 0) {
        for(let variavel of this.parametro.variaveis) {
          if(variavel.nome === row.nome) {
            variavel.variaveis_lista = row.data.map((d: any) => { return { id: d.variaveis_lista.id, nome: d.variaveis_lista.nome, is_visivel: d.variaveis_lista.is_visivel } });
            break;
          }
        }
      }

      this._parametro.setParametro(this.parametro);
    }
  }

  private async getTextFromFile1(event: any) {
    this.file1 = event.target.files[0];
    let fileContent = await this.file1?.text() ||  "";
    
    return fileContent;
  }

  private async getTextFromFile2(event: any, row: any) {
    if(row) { row.file = event.target.files[0]; }
    
    let fileContent = await row.file?.text() ||  "";
    
    return fileContent;
  }

  public async importDataFromCSV1(event: any) {
    let fileContent = await this.getTextFromFile1(event);
    this.importedData1 = this._csv.importDataFromCSV(fileContent);
    
    this.initDataSource1(this.importedData1);
  }

  public async importDataFromCSV2(event: any, row: any) {
    let fileContent = await this.getTextFromFile2(event, row);

    if(row) { row.importedData = this._csv.importDataFromCSV(fileContent); }
    
    this.initDataSource2(row);
  }

  public initDataSource1(data: Array<any>): void {
    this.data1 = [];
    this.data1EmptyFlag = false;
    this.data1MissingColumns = [];
    this.data1DuplicateVariables = false;
    this.data1MissingKeyVariable = false;
    
    if(data?.length < 1) { this.data1EmptyFlag = true; }

    if(!this.data1EmptyFlag) {
      const firstLine: any = data[0];
      const columns: any[] = Object.getOwnPropertyNames(firstLine);
  
      if(!columns.includes("nome")) { this.data1MissingColumns.push("nome"); }
      if(!columns.includes("descricao")) { this.data1MissingColumns.push("descricao"); }
      if(!columns.includes("is_chave")) { this.data1MissingColumns.push("is_chave"); }
      if(!columns.includes("tipo")) { this.data1MissingColumns.push("tipo"); }
      if(!columns.includes("tamanho")) { this.data1MissingColumns.push("tamanho"); }
      if(!columns.includes("qtd_casas_decimais")) { this.data1MissingColumns.push("qtd_casas_decimais"); }
    }

    if(this.data1MissingColumns.length == 0) {
      for(let row of data) {
        const nextID: string = StringUtils.uuidv4();
        
        let nome: string = row["nome"] || null;
        let nomeObrigatorio: boolean = false;
        let nomeInvalido: boolean = false;
        let nomeEnorme: boolean = false;
        let expNome: RegExp = new RegExp(/^[A-Za-z0-9_]+$/);
  
        if(!nome) { nomeObrigatorio = true; }
        else if(nome.length > 100) { nomeEnorme = true; }
        else if(!expNome.test(nome)) { nomeInvalido = true; }
  
        let tipo: string = row["tipo"] || null;
        let tipoObrigatorio: boolean = false;
        let tipoInexistente: boolean = false;
  
        if(!tipo) { tipoObrigatorio = true; }
        else if(!['DECIMAL','NUMERICO','TEXTO','LISTA'].includes(tipo)) { tipoInexistente = true; }
  
        let descricao: string = row["descricao"] || null;
        let descricaoObrigatorio: boolean = false;
        let descricaoEnorme: boolean = false;
  
        if(!descricao) { descricaoObrigatorio = true; }
        else if(descricao.length > 350) { descricaoEnorme = true; }
  
        let tamanho: any = row["tamanho"] || null;
        let tamanhoObrigatorio: boolean = false;
        let tamanhoNaoNumerico: boolean = false;
        let tamanhoIgualZero: boolean = false;
  
        if(!tamanho) { tamanhoObrigatorio = true; }
        else {
          if(isNaN(tamanho)) { tamanhoNaoNumerico = true; }
          else {
            tamanho = Number.parseInt(tamanho);
  
            if(tamanho <= 0) { tamanhoIgualZero = true; }
          }
        }
  
        let qtd_casas_decimais: any = row["qtd_casas_decimais"] || null;
        let qtdCasasDecimaisObrigatorio: boolean = false;
        let qtdCasasDecimaisNaoNumerico: boolean = false;
        let qtdCasasDecimaisIgualZero: boolean = false;
  
        if(tipo == "DECIMAL") {
          if(!qtd_casas_decimais) { qtdCasasDecimaisObrigatorio = true; }
          else {
            if(isNaN(qtd_casas_decimais)) { qtdCasasDecimaisNaoNumerico = true; }
            else {
              qtd_casas_decimais = Number.parseInt(qtd_casas_decimais);
  
              if(qtd_casas_decimais <= 0) { qtdCasasDecimaisIgualZero = true; }
            }
          }
        }
        
        let chave: any = row["is_chave"] || null;
        let chaveObrigatorio: boolean = false;
        let chaveNaoBooleano: boolean = false;
  
        if(!chave) { chaveObrigatorio = true; }
        else {
          if(chave == "true") { chave = true; }
          else if(chave == "false") { chave = false; }
          else { chaveNaoBooleano = true; }
        }
  
        const variavelUpload: VariavelUpload = {
          variavel: {
            id: nextID,
            nome: nome,
            tipo: tipo as "DECIMAL" | "NUMERICO" | "TEXTO" | "LISTA",
            descricao: descricao,
            tamanho: tamanho,
            qtd_casas_decimais: qtd_casas_decimais,
            is_chave: chave,
            variaveis_lista: [],
            parametro_id: this.parametro?.id
          },
          controle: {
            nomeObrigatorio: nomeObrigatorio,
            nomeEnorme: nomeEnorme,
            nomeInvalido: nomeInvalido,
            tipoObrigatorio: tipoObrigatorio,
            tipoInexistente: tipoInexistente,
            descricaoObrigatorio: descricaoObrigatorio,
            descricaoEnorme: descricaoEnorme,
            tamanhoObrigatorio: tamanhoObrigatorio,
            tamanhoNaoNumerico: tamanhoNaoNumerico,
            tamanhoIgualZero: tamanhoIgualZero,
            qtdCasasDecimaisObrigatorio: qtdCasasDecimaisObrigatorio,
            qtdCasasDecimaisNaoNumerico: qtdCasasDecimaisNaoNumerico,
            qtdCasasDecimaisIgualZero: qtdCasasDecimaisIgualZero,
            chaveObrigatorio: chaveObrigatorio,
            chaveNaoBooleano: chaveNaoBooleano
          }
        };
  
        this.data1.push(variavelUpload);
      }
  
      this.dataSource1 = new MatTableDataSource(this.data1);
    }
    
    this.updateStatus1();
  }

  public initDataSource2(row: any): void {
    if(row) {
      row.data = [];
      row.dataEmptyFlag = false;
      row.dataMissingColumns = [];
      
      if(row.importedData?.length < 1) { row.dataEmptyFlag = true; }

      if(!row.dataEmptyFlag) {
        const firstLine: any = row.importedData[0];
        const columns: any[] = Object.getOwnPropertyNames(firstLine);
    
        if(!columns.includes("nome")) { row.dataMissingColumns.push("nome"); }
        if(!columns.includes("is_visivel")) { row.dataMissingColumns.push("is_visivel"); }
      }

      if(row.dataMissingColumns.length == 0) {
        for(let item of row.importedData) {
          const nextID: string = StringUtils.uuidv4();
          
          let nome: string = item["nome"] || null;
          let nomeObrigatorio: boolean = false;
    
          if(!nome) { nomeObrigatorio = true; }
    
          let is_visivel: any = item["is_visivel"] || null;
          let isVisivelObrigatorio: boolean = false;
          let isVisivelNaoBooleano: boolean = false;
    
          if(!is_visivel) { isVisivelObrigatorio = true; }
          else {
            if(is_visivel == "true") { is_visivel = true; }
            else if(is_visivel == "false") { is_visivel = false; }
            else { isVisivelNaoBooleano = true; }
          }

          row.data.push({
            variaveis_lista: { id: nextID, nome: nome, is_visivel: is_visivel },
            controle: { nomeObrigatorio: nomeObrigatorio, isVisivelObrigatorio: isVisivelObrigatorio, isVisivelNaoBooleano: isVisivelNaoBooleano }          
          });
        }
      }

      this.updateStatus2(row);
    }
  }

  public updateStatus1(): void {
    if(this.data1EmptyFlag || this.data1MissingColumns?.length > 0) {
      this.data1Status = "INVALID";
      return;
    }

    let rowErrorFlag: boolean = false;

    for(let row of this.data1) {
      if(row.controle) {
        const controle = row.controle;
        rowErrorFlag =  controle.nomeObrigatorio || controle.nomeEnorme || controle.nomeInvalido ||
                        controle.tipoObrigatorio || controle.tipoInexistente ||
                        controle.descricaoObrigatorio || controle.descricaoEnorme ||
                        controle.tamanhoObrigatorio || controle.tamanhoNaoNumerico ||
                        controle.tamanhoIgualZero || controle.qtdCasasDecimaisObrigatorio ||
                        controle.qtdCasasDecimaisNaoNumerico || controle.qtdCasasDecimaisIgualZero ||
                        controle.chaveObrigatorio || controle.chaveNaoBooleano;
      }

      if(rowErrorFlag) { break; }
    }

    if(rowErrorFlag) {
      this.data1Status = "INVALID";
      return;
    }

    const variaveisNome: string[] = this.data1.map(d1 => d1.variavel.nome);
    const variaveisNomeSet: Set<string> = new Set(variaveisNome);

    if(variaveisNome.length != variaveisNomeSet.size) {
      this.data1DuplicateVariables = true;
      this.data1Status = "INVALID";
      return;
    }

    const hasParametroChave: boolean = this.parametro.modo == "CHAVE";

    if(hasParametroChave) {
      const variaveisChave: boolean[] = this.data1.map(d1 => d1.variavel.is_chave);

      if(!variaveisChave.includes(true)) {
        this.data1MissingKeyVariable = true;
        this.data1Status = "INVALID";
        return;
      }
    }

    this.data1Status = "VALID";
  }

  public updateStatus2(row: any): void {
    if(row) {
      if(row.dataEmptyFlag || row.dataMissingColumns?.length > 0) {
        row.dataStatus = "INVALID";
        return;
      }

      let rowErrorFlag: boolean = false;

      for(let item of row.data) {
        if(item.controle) {
          rowErrorFlag =  item.controle.nomeObrigatorio || item.controle.isVisivelObrigatorio || item.controle.isVisivelNaoBooleano;
        }

        if(rowErrorFlag) { break; }
      }

      if(rowErrorFlag) {
        row.dataStatus = "INVALID";
        return;
      }

      row.dataStatus = "VALID";
    }
  }
}
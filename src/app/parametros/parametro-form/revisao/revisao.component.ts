import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ParametroService } from '../../../../shared/services';
import { Evento, Parametro, Variavel } from '../../../../shared/interfaces';

@Component({
  selector: 'app-revisao',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatExpansionModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule 
  ],
  templateUrl: './revisao.component.html',
  styleUrl: './revisao.component.scss'
})
export class RevisaoComponent {
  private _parametro = inject(ParametroService);

  constructor(){ }

  public parametro!: Parametro;

  public displayedColumnsVariaveis: string[] = ["nome", "tipo", "is_chave", "tamanho", "qtd_casas_decimais"];
  public dataSourceVariaveis: MatTableDataSource<Variavel> = new MatTableDataSource<Variavel>([]); // Variavel
  public dataVariaveis: Variavel[] = []; // Variavel

  public displayedColumnsDados: string[] = [];
  public dataSourceDados: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  public dataDados: any[] = [];

  public displayedColumnsEventos: string[] = ["nome", "sas_user_name", "created_at", "actions"];
  public dataSourceEventos: MatTableDataSource<Evento> = new MatTableDataSource<Evento>([]);
  public dataEventos: Evento[] = [];

  ngOnInit(): void {
    this._parametro.getParametro().subscribe(parametro => {
      if(parametro) {
        this.parametro = parametro;

        this.initVariaveis();
        this.initDados();
        this.initEventos();
      }
    });
  }

  public initVariaveis(): void {
    this.dataVariaveis = this.parametro.variaveis || [];

    if(this.dataVariaveis && this.dataVariaveis.length > 0) {
      this.dataSourceVariaveis = new MatTableDataSource(this.dataVariaveis);
    }
  }

  public initDados(): void {
    this.displayedColumnsDados = [];

    if(this.parametro.variaveis && this.parametro.variaveis.length > 0) {
      for(let varAux of this.parametro.variaveis) { this.displayedColumnsDados.push(varAux.nome); }
    }

    this.dataDados = [];

    if(this.parametro.dados && this.parametro.dados.length > 0) {
      for(let dado of this.parametro.dados) {
        let dadoAux: any = dado;
        let obj: any = { };

        if(this.parametro.variaveis && this.parametro.variaveis.length > 0) {
          for(let variavel of this.parametro.variaveis) {
            const dadoVar: any = dadoAux['dado-control-' + variavel.id];
  
            if(variavel.tipo == "LISTA") { obj[variavel.nome] = (dadoVar || []).map((d: any) => d.nome).join(", "); }
            else { obj[variavel.nome] = dadoVar; }                   
          }
        }        

        this.dataDados.push(obj)
      }
    }

    if(this.dataDados && this.dataDados.length > 0) {
      this.dataSourceDados = new MatTableDataSource(this.dataDados);
    }
  }

  public getDataVigencia(): string {
    // let dataFormat: string = "-";
    // let dataVigencia: any = this.parametro?.data_hora_vigencia || null;
    // let horaVigencia: any = this.parametro?.parametro?.horaVigencia || null;


    // if(horaVigencia && dataVigencia && dataVigencia._d) {
    //   dataFormat = dataVigencia._d.toLocaleDateString() + " - " + horaVigencia;
    // }

    return this.parametro?.data_hora_vigencia?.toLocaleDateString() || "-";
  }

  public initEventos(): void {
    this.dataEventos = this.parametro.eventos || [];

    if(this.dataEventos && this.dataEventos.length > 0) {
      this.dataSourceEventos = new MatTableDataSource(this.dataEventos.reverse());
    }
  }
}
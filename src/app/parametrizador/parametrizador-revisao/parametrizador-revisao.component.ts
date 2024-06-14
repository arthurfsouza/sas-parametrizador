import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ParametrizadorService } from '../parametrizador.service';

@Component({
  selector: 'app-parametrizador-revisao',
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
  templateUrl: './parametrizador-revisao.component.html',
  styleUrl: './parametrizador-revisao.component.scss'
})
export class ParametrizadorRevisaoComponent implements OnInit {
  private _parametrizador = inject(ParametrizadorService);
  public parametrizador!: any; // Parametrizador 

  public displayedColumnsVariaveis: string[] = ["nome", "tipo", "chave", "tamanho", "qtdCasasDecimais"];
  public dataSourceVariaveis: MatTableDataSource<any> = new MatTableDataSource<any>([]); // Variavel
  public dataVariaveis: any[] = []; // Variavel

  public displayedColumnsDados: string[] = [];
  public dataSourceDados: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  public dataDados: any[] = [];

  public displayedColumnsEventos: string[] = ["nome", "dataOcorrencia", "responsavel", "actions"];
  public dataSourceEventos: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  public dataEventos: any[] = [];

  ngOnInit(): void {
    this._parametrizador.getParametrizador().subscribe(parametrizador => {
      if(parametrizador) {
        this.parametrizador = parametrizador;

        this.initVariaveis();
        this.initDados();
        this.initEventos();
      }
    });
  }

  public initVariaveis(): void {
    this.dataVariaveis = this.parametrizador.variaveis || [];

    if(this.dataVariaveis && this.dataVariaveis.length > 0) {
      this.dataSourceVariaveis = new MatTableDataSource(this.dataVariaveis);
    }
  }

  public initDados(): void {
    this.displayedColumnsDados = [];

    for(let varAux of this.parametrizador.variaveis) { this.displayedColumnsDados.push(varAux.nome); }

    this.dataDados = [];

    if(this.parametrizador.dados && this.parametrizador.dados.length > 0) {
      for(let dado of this.parametrizador.dados) {
        let obj: any = { };

        for(let variavel of this.parametrizador.variaveis) {
          const dadoVar: any = dado['dado-control-' + variavel.id];

          if(variavel.tipo == "LISTA") { obj[variavel.nome] = (dadoVar || []).map((d: any) => d.nome).join(", "); }
          else { obj[variavel.nome] = dadoVar; }                   
        }

        this.dataDados.push(obj)
      }
    }

    if(this.dataDados && this.dataDados.length > 0) {
      this.dataSourceDados = new MatTableDataSource(this.dataDados);
    }
  }

  public getDataVigencia(): string {
    let dataFormat: string = "-";
    let dataVigencia: any = this.parametrizador?.parametro?.dataVigencia || null;
    let horaVigencia: any = this.parametrizador?.parametro?.horaVigencia || null;


    if(horaVigencia && dataVigencia && dataVigencia._d) {
      dataFormat = dataVigencia._d.toLocaleDateString() + " - " + horaVigencia;
    }

    return dataFormat;
  }

  public initEventos(): void {
    this.dataEventos = this.parametrizador.eventos || [];

    if(this.dataEventos && this.dataEventos.length > 0) {
      this.dataSourceEventos = new MatTableDataSource(this.dataEventos.reverse());
    }
  }
}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ParametroService, SnackbarMessagesService } from '../../../../shared/services';
import { Dado, Evento, Parametro, ParametroStatus, ParametroStatusCode, Variavel } from '../../../../shared/interfaces';
import { parametrosStatus } from '../../../../shared/mockups';
import { api, general } from '../../../../shared/configurations';

@Component({
  selector: 'app-revisao',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
  private _http = inject(HttpClient);
  private _snackbar = inject(SnackbarMessagesService);
  private _parametro = inject(ParametroService);

  constructor(private _router: Router){ }

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

  public parametroStatus: ParametroStatus[] = parametrosStatus;

  public acoesFG: FormGroup = new FormGroup({
    acao: new FormControl(null, [Validators.required])
  });

  public acoes: { id: number; status_code: ParametroStatusCode, description: string }[] = [
    // { id: 1, status_code: "002", description: "Editar Parâmetro" },
    // { id: 2, status_code: "004", description: "Disponibilizar para Revisão" },
    { id: 3, status_code: "005", description: "Enviar para Ambiente de Homologação" },
    // { id: 4, status_code: "007", description: "Recusar: Riscos" },
    // { id: 5, status_code: "008", description: "Aprovar: Riscos" },
    // { id: 6, status_code: "010", description: "Recusar: T&O" },
    // { id: 7, status_code: "011", description: "Aprovar: T&O" },
    // { id: 8, status_code: "013", description: "Gerar nova Versão" }
  ];

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

  public onChangeAcao(event$: any): void { }

  public onSaveStatus(): void {
    if(this.acoesFG.valid) {
      const acao: { id: number; status_code: ParametroStatusCode, description: string } = this.acoesFG.value['acao'];

      if(acao.status_code == "005") {
        const body: any = { status_code: "005", justificativa: null };

        this._http.post(api.private.parametro.status.post.replace("{PARAMETRO_ID}", this.parametro.id), body).subscribe(
          (response: any) => {
            if(response?.message) {
              this._snackbar.showSnackbarMessages({ message: response.message, type: 'success', has_duration: true });

              this._router.navigate([general.routes.private.parametros]);
            }
          },
          err => {
            if(err?.error?.error) {
              this.showErros({ error: err.error.error, campos_error: err.error.campos_error || [] });
            }
          }
        )
      }
    }
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
        let informacao = dado.informacao || { };     

        this.dataDados.push(informacao);
      }
    }

    if(this.dataDados && this.dataDados.length > 0) {
      this.dataSourceDados = new MatTableDataSource(this.dataDados);
    }
  }

  public getDate(date: any): Date { return new Date(date); }

  public initEventos(): void {
    this.dataEventos = this.parametro.eventos || [];
    this.dataSourceEventos = new MatTableDataSource(this.dataEventos);

    if(this.dataEventos && this.dataEventos.length > 0) {
      for(let evento of this.dataEventos) {
        evento.parametro_status = this.parametroStatus.find((ps: any) => ps.code = evento.status_code);
      }
      
      this.dataSourceEventos = new MatTableDataSource(this.dataEventos);
    }
  }

  public getStatusType(status_code: string): string {
    const parametroStatus: ParametroStatus | undefined = this.parametroStatus.find((ps: any) => ps.code = status_code);

    return parametroStatus?.type || "";
  }

  public getStatusName(status_code: string): string {
    const parametroStatus: ParametroStatus | undefined = this.parametroStatus.find((ps: any) => ps.code = status_code);

    return parametroStatus?.description || "";
  }

  public showErros(e: { error: string, campos_error: string[] }): void {
    this._snackbar.showSnackbarMessages({ message: e.error, type: 'error', has_duration: true });
  }

  public compareObjects(o1: any, o2: any): boolean { return o1?.id === o2?.id; }
}
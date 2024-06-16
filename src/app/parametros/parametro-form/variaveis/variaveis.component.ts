import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VariavelFormComponent } from './variavel-form/variavel-form.component';
import { VariavelUploadComponent } from './variavel-upload/variavel-upload.component';
import { ParametroService, SnackbarMessagesService } from '../../../../shared/services';
import { Parametro, Variavel } from '../../../../shared/interfaces';
import { api } from '../../../../shared/configurations';

import StringUtils from '../../../../shared/utils/string/string.utils';

@Component({
  selector: 'app-variaveis',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './variaveis.component.html',
  styleUrl: './variaveis.component.scss'
})
export class VariaveisComponent {
  private _http = inject(HttpClient);
  private _snackbar = inject(SnackbarMessagesService);
  private _parametro = inject(ParametroService);
  
  constructor(public dialog: MatDialog){ }
  
  public parametro!: Parametro;
  
  public displayedColumns: string[] = ["nome", "tipo", "is_chave", "tamanho", "qtd_casas_decimais", "actions"];
  public dataSource: MatTableDataSource<Variavel> = new MatTableDataSource<Variavel>([]);
  public data: Variavel[] = [];

  ngOnInit(): void {
    this._parametro.getParametro().subscribe(parametro => {
      if(parametro) {
        this.parametro = parametro;

        if(this.parametro.variaveis && this.parametro.variaveis.length > 0) {
          this.data = this.parametro.variaveis;
          this.dataSource = new MatTableDataSource(this.data);
        }
      }
    });
  }

  public onAddVariavel(): void {
    const dialogRef = this.dialog.open(VariavelFormComponent, {
      width: '800px',
      height: '100vh',
      data: { }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result && result.variavel) {
        this.data.push({
          id: StringUtils.uuidv4(),
          nome: result.variavel.nome,
          descricao: result.variavel.descricao,
          tipo: result.variavel.tipo?.tipo || null,
          qtd_casas_decimais: result.variavel?.qtd_casas_decimais || null,
          tamanho: result.variavel.tamanho,
          is_chave: result.variavel.is_chave,
          variavel_lista: result.variavel?.variavel_lista || null,
          parametro_id: this.parametro?.id
        });

        this.dataSource = new MatTableDataSource(this.data);
      }
    });
  }

  public onEditVar(row: Variavel): void {
    const dialogRef = this.dialog.open(VariavelFormComponent, {
      width: '800px',
      height: '100vh',
      data: { variavel: row }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result && result.variavel) {
        for(let item of this.data) {
          if(item.id == row.id) {
            item.nome = result.variavel.nome;
            item.tipo = result.variavel.tipo.codigo;
            item.descricao = result.variavel.descricao;
            item.qtd_casas_decimais = result.variavel.qtd_casas_decimais || null;
            item.tamanho = result.variavel.tamanho;
            item.is_chave = result.variavel.is_chave;
            item.variavel_lista = result.variavel.variavel_lista || null;

            break;
          }
        }

        this.dataSource = new MatTableDataSource(this.data);
      }
    });
  }

  public onDeleteVar(row: Variavel): void { 
    let index = 0;

    for(let i = 0; i < this.data.length; i++) {
      if(this.data[i].id === row.id) {
        index = i;
        break;
      }
    }

    this.data.splice(index, 1);

    this.dataSource = new MatTableDataSource(this.data);
  }

  public variaveisStepperIsValid(): boolean {
    let valid: boolean = false;

    if(this.parametro) {
      const hasGlobalKey: boolean = this.parametro.modo == "CHAVE";

      if(hasGlobalKey) {
        const variaveisWithKeys: Variavel[] = this.data.filter(d => d.is_chave == true);

        if(variaveisWithKeys && variaveisWithKeys.length > 0) { valid = true; }
      }
      else { valid = (this.data.length > 0); }
    }

    return valid;
  }

  public onOpenVariaveisUpload(): void {
    const dialogRef = this.dialog.open(VariavelUploadComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%'
    });

    dialogRef.afterClosed().subscribe((result) => { });
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

  public onCreate(): Promise<any> {
    const p = new Promise((resolve) => {
      const variaveis: any[] = [];

      this.data.map(variavel => {
        variaveis.push({
          nome: variavel.nome,
          descricao: variavel.descricao,
          tipo: variavel.tipo,
          is_chave: variavel.is_chave,
          tamanho: variavel.tamanho,
          qtd_casas_decimais: variavel.qtd_casas_decimais,
          variavel_lista: variavel.variavel_lista?.length ? variavel.variavel_lista.map(l => {
            return { nome: l.nome, is_visivel: l.is_visivel }
          }) : []
        })
      });
  
      this._http.post(api.private.parametro.variavel.post.replace("{PARAMETRO_ID}", this.parametro.id), variaveis).subscribe(
        (response: any) => {
          if(response?.message) {
            this._snackbar.showSnackbarMessages({ message: response.message, type: 'success', has_duration: true });
  
            if(response.id) { this._loadingParametroByID(response.id); }
            resolve(true)
          }
        },
        err => {
          if(err?.error?.error) {
            this.showErros({ error: err.error.error, campos_error: err.error.campos_error || [] });
          }

          resolve(false)
        }
      )
    });
    
    return p;
  }

  public showErros(e: { error: string, campos_error: string[] }): void {
    this._snackbar.showSnackbarMessages({ message: e.error, type: 'error', has_duration: true });
  }
}
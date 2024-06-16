import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import ptBr from '@angular/common/locales/pt';
import { ParametrizadorService } from '../parametrizador.service';
import { HttpClient } from '@angular/common/http';
import { Cluster, Politica } from '../../../shared/interfaces';
import { clusters, politicas } from '../../../shared/mockups';

registerLocaleData(ptBr)


@Component({
  selector: 'app-parametrizador-parametro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule
  ],
  templateUrl: './parametrizador-parametro.component.html',
  styleUrl: './parametrizador-parametro.component.scss',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt' },
    provideMomentDateAdapter()
  ]
})
export class ParametrizadorParametroComponent implements OnInit {
  private _http = inject(HttpClient);
  private _parametrizador = inject(ParametrizadorService);
  public parametrizador!: any; // Parametrizador

  public minDate: Date = new Date();
  
  public parametroFG: FormGroup = new FormGroup({
    nome: new FormControl(null, [Validators.required, Validators.pattern("[A-Za-z0-9_]+")]),
    descricao: new FormControl(null, [Validators.required, Validators.maxLength(350)]),
    modo: new FormControl(null, [Validators.required]),
    dataVigencia: new FormControl(this.minDate, [Validators.required]),
    horaVigencia: new FormControl(this.minDate, [Validators.required]),
    cluster: new FormControl(null, [Validators.required]),
    politica: new FormControl(null, [Validators.required])
  });
  
  public clusters: Cluster[] = clusters.filter(c => c.is_ativo == true);
  public politicas: Politica[] = politicas.filter(p => p.is_ativo == true);
  
  public sasFG: FormGroup = new FormGroup({
    folder: new FormControl(null)
  });

  public folders: {id: string, description: string}[] = [];

  ngOnInit(): void {
    this.parametroFG.controls['politica'].disable();

    this._parametrizador.getParametrizador().subscribe(parametrizador => {
      if(parametrizador) {
        this.parametrizador = parametrizador;

        if(this.parametrizador && this.parametrizador.parametro && this.parametrizador.parametro.id) {
          this.parametroFG.controls['nome'].setValue(this.parametrizador.parametro.nome);
          this.parametroFG.controls['descricao'].setValue(this.parametrizador.parametro.descricao);
          this.parametroFG.controls['modo'].setValue(this.parametrizador.parametro.modo);
          this.parametroFG.controls['dataVigencia'].setValue(this.parametrizador.parametro.dataVigencia);
          this.parametroFG.controls['horaVigencia'].setValue(this.parametrizador.parametro.horaVigencia);
          this.parametroFG.controls['cluster'].setValue(this.parametrizador.parametro.cluster);
          this.parametroFG.controls['politica'].setValue(this.parametrizador.parametro.politica);
        }
      }
    });

    this.listFoldersSAS();
  }

  public listFoldersSAS(): void {
    this._http.get("http://127.0.0.1:5000/api-sas", { }).subscribe(
      (response: any) => {
        if(response && response.folder_response) {
          const items: any[] = response.folder_response.items || [];
          const folders: any[] = items.map(item => {
            return { id: item.id, description: item.description || "undefined" }; 
          });

          this.folders = folders || [];
        }
      },
      error => { console.log(error); }
    )
  }

  public onChangeCluster(event$: any): void {
    this.parametroFG.controls['politica'].setValue(null);

    if(event$ && event$.value && event$.value.id) {
      this.politicas = politicas.filter(p => p.is_ativo == true && p?.cluster?.id == event$.value.id);
      this.parametroFG.controls['politica'].enable();
    }
    else {
      this.parametroFG.controls['politica'].disable();
    }    
  }

  public compareObjects(o1: any, o2: any): boolean { return o1?.id === o2?.id; }
}
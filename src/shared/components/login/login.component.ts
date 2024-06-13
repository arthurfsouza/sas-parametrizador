import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LocalStorageService, SnackbarMessagesService } from '../../services';
import { api } from '../../configurations';
import { Auth, AuthService } from '../../guards';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private _http = inject(HttpClient);
  private _localStorage = inject(LocalStorageService);  
  private _snackbar = inject(SnackbarMessagesService);  
  
  constructor(public dialogRef: MatDialogRef<LoginComponent>) { }

  public loginFG: FormGroup = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
    connection_flag: new FormControl(true, [Validators.required])
  });

  public hidePassword: boolean = true;

  ngOnInit(): void { }

  public onLogin(): void {
    if(this.loginFG.valid) {
      const body: any = { username: this.loginFG.value['username'], password: this.loginFG.value['password'] };      

      this._http.post(api.private.login, body).subscribe(
        (response: any) => {
          if(response) {
            const auth: Auth = {
              token: response.token,
              expires_in: response.expires_in,
              last_updated: new Date(),
              connection_flag: this.loginFG.value['connection_flag'],
              user: {
                id: response.user_id,
                name: response.user_name,
                email: response.user_email,
                permissions: response.santander_memberships_ids,
                username: body.username,
                password: body.password
              }
            };

            this._localStorage.storageData({ type: 'auth', data: auth });
            this._snackbar.showSnackbarMessages({ message: "Login realizado com sucesso!", type: 'success', has_duration: true });
            this.dialogRef.close("closed");
          }
        }
      )
    }
  }
}
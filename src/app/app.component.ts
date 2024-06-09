import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../shared/services/loader/loader.service';
import { Subscription } from 'rxjs';
import { SASAuthService } from '../shared/services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private _SASAuth = inject(SASAuthService);
  private _loader = inject(LoaderService);

  private _subscriptions: Subscription[] = [];

  public title = 'sas-parametrizador';
  public SASInstance: any;
  public loading: boolean = false;

  ngOnInit(): void {
    this._SASAuth.initialize();

    this._subscriptions.push(
      this._loader.getLoadingStatus().subscribe(value => { this.loading = value; })
    );

    this._subscriptions.push(
      this._SASAuth.getInstance().subscribe(instance => { this.SASInstance = instance; console.log("SAS Instance: ", this.SASInstance); })
    );
  }

  ngOnDestroy(): void { this._subscriptions.map(s => { s.unsubscribe(); }); }
}

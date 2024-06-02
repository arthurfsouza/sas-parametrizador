import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../shared/services/loader/loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private _loader = inject(LoaderService);
  private subscriptions: Subscription[] = [];

  public title = 'sas-parametrizador';
  public loading: boolean = false;

  ngOnInit(): void {
    this.subscriptions.push(
      this._loader.getLoadingStatus().subscribe(value => { this.loading = value; })
    );
  }

  ngOnDestroy(): void { this.subscriptions.map(s => { s.unsubscribe(); }); }
}

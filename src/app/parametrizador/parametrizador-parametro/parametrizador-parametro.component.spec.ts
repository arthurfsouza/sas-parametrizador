import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrizadorParametroComponent } from './parametrizador-parametro.component';

describe('ParametrizadorParametroComponent', () => {
  let component: ParametrizadorParametroComponent;
  let fixture: ComponentFixture<ParametrizadorParametroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametrizadorParametroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParametrizadorParametroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

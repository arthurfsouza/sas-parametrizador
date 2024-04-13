import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrizadorRevisaoComponent } from './parametrizador-revisao.component';

describe('ParametrizadorRevisaoComponent', () => {
  let component: ParametrizadorRevisaoComponent;
  let fixture: ComponentFixture<ParametrizadorRevisaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametrizadorRevisaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParametrizadorRevisaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

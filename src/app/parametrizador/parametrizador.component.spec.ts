import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrizadorComponent } from './parametrizador.component';

describe('ParametrizadorComponent', () => {
  let component: ParametrizadorComponent;
  let fixture: ComponentFixture<ParametrizadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParametrizadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParametrizadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

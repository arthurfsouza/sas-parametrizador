import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaFormComponent } from './politica-form.component';

describe('PoliticaFormComponent', () => {
  let component: PoliticaFormComponent;
  let fixture: ComponentFixture<PoliticaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticaFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoliticaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

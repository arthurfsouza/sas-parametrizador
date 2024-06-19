import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariavelUploadComponent } from './variavel-upload.component';

describe('VariavelUploadComponent', () => {
  let component: VariavelUploadComponent;
  let fixture: ComponentFixture<VariavelUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariavelUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VariavelUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

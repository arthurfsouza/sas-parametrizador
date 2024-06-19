import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuNavigatorComponent } from './menu-navigator.component';

describe('MenuNavigatorComponent', () => {
  let component: MenuNavigatorComponent;
  let fixture: ComponentFixture<MenuNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuNavigatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

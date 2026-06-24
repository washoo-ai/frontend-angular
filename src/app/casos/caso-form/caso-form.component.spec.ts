import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasoFormComponent } from './caso-form.component';

describe('CasosFormComponent', () => {
  let component: CasoFormComponent;
  let fixture: ComponentFixture<CasoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CasoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

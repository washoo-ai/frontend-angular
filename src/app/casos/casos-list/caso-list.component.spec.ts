import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CasoListComponent } from './casos-list.component';


describe('CasosListComponent', () => {
  let component: CasoListComponent;
  let fixture: ComponentFixture<CasoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasoListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CasoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

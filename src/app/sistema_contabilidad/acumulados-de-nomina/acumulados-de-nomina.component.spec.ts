import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcumuladosDeNominaComponent } from './acumulados-de-nomina.component';

describe('AcumuladosDeNominaComponent', () => {
  let component: AcumuladosDeNominaComponent;
  let fixture: ComponentFixture<AcumuladosDeNominaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcumuladosDeNominaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcumuladosDeNominaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

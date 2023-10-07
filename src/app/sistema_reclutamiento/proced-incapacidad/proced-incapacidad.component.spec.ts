import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedIncapacidadComponent } from './proced-incapacidad.component';

describe('ProcedIncapacidadComponent', () => {
  let component: ProcedIncapacidadComponent;
  let fixture: ComponentFixture<ProcedIncapacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcedIncapacidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedIncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

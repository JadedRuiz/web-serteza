import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcedBitacoraComponent } from './proced-bitacora.component';

describe('ProcedBitacoraComponent', () => {
  let component: ProcedBitacoraComponent;
  let fixture: ComponentFixture<ProcedBitacoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcedBitacoraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcedBitacoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoTurnosComponent } from './catalogo-turnos.component';

describe('CatalogoTurnosComponent', () => {
  let component: CatalogoTurnosComponent;
  let fixture: ComponentFixture<CatalogoTurnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoTurnosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

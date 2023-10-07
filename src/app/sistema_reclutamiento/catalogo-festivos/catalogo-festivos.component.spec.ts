import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoFestivosComponent } from './catalogo-festivos.component';

describe('CatalogoFestivosComponent', () => {
  let component: CatalogoFestivosComponent;
  let fixture: ComponentFixture<CatalogoFestivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoFestivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoFestivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

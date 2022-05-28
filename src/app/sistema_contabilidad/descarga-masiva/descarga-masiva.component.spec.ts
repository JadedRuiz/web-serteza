import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargaMasivaComponent } from './descarga-masiva.component';

describe('DescargaMasivaComponent', () => {
  let component: DescargaMasivaComponent;
  let fixture: ComponentFixture<DescargaMasivaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescargaMasivaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescargaMasivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIntegraComponent } from './modal-integra.component';

describe('ModalIntegraComponent', () => {
  let component: ModalIntegraComponent;
  let fixture: ComponentFixture<ModalIntegraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalIntegraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIntegraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

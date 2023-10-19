import { TestBed } from '@angular/core/testing';

import { JustificacionService } from './justificacion.service';

describe('JustificacionService', () => {
  let service: JustificacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JustificacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

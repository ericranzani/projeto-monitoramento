import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AtivoService } from './ativo';

describe('AtivoService', () => {
  let service: AtivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        AtivoService,
        provideHttpClient()
      ]
    });

    service = TestBed.inject(AtivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

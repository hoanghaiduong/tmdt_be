import { Test, TestingModule } from '@nestjs/testing';
import { RequestFormService } from './request-form.service';

describe('RequestFormService', () => {
  let service: RequestFormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestFormService],
    }).compile();

    service = module.get<RequestFormService>(RequestFormService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

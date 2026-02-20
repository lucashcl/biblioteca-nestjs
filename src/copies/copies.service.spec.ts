import { Test, TestingModule } from '@nestjs/testing';
import { CopiesService } from './copies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Copy } from './entities/copy.entity';

describe('CopiesService', () => {
  let service: CopiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CopiesService,
        {
          provide: getRepositoryToken(Copy),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CopiesService>(CopiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { LoansService } from './loans.service';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';

describe('LoansService', () => {
  let service: LoansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoansService,
        {
          provide: getDataSourceToken(),
          useValue: {
            getRepository: () => ({
              findOne: jest.fn(),
            }),
          },
        },
        {
          provide: getRepositoryToken(Loan),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<LoansService>(LoansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

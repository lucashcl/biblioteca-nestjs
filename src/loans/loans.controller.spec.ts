import { Test, TestingModule } from '@nestjs/testing';
import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';

describe('LoansController', () => {
  let controller: LoansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoansController],
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

    controller = module.get<LoansController>(LoansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

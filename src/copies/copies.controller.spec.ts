import { Test, TestingModule } from '@nestjs/testing';
import { CopiesController } from './copies.controller';
import { CopiesService } from './copies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Copy } from './entities/copy.entity';

describe('CopiesController', () => {
  let controller: CopiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CopiesController],
      providers: [
        CopiesService,
        {
          provide: getRepositoryToken(Copy),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CopiesController>(CopiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

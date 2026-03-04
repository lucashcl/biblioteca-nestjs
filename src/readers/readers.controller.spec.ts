import { Test, TestingModule } from '@nestjs/testing';
import { ReadersController } from './readers.controller';
import { ReadersService } from './readers.service';
import { Reader } from './entities/reader.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ReadersController', () => {
  let controller: ReadersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadersController],
      providers: [
        ReadersService,
        {
          provide: getRepositoryToken(Reader),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ReadersController>(ReadersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

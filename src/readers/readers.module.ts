import { Module } from '@nestjs/common';
import { ReadersService } from './readers.service';
import { ReadersController } from './readers.controller';

@Module({
  controllers: [ReadersController],
  providers: [ReadersService],
})
export class ReadersModule {}

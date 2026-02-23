import { Module } from '@nestjs/common';
import { ReadersService } from './readers.service';
import { ReadersController } from './readers.controller';
import { Reader } from './entities/reader.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Reader])],
  controllers: [ReadersController],
  providers: [ReadersService],
})
export class ReadersModule {}

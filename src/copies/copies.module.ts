import { Module } from '@nestjs/common';
import { CopiesService } from './copies.service';
import { CopiesController } from './copies.controller';
import { Copy } from './entities/copy.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Copy])],
  controllers: [CopiesController],
  providers: [CopiesService],
})
export class CopiesModule {}

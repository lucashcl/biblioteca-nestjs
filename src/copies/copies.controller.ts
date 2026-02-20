import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CopiesService } from './copies.service';
import { CreateCopyDto } from './dto/create-copy.dto';
import { UpdateCopyDto } from './dto/update-copy.dto';
import { CopyQueryDto } from './dto/copy-query.dto';

@Controller('books/:bookId/copies')
export class CopiesController {
  constructor(private readonly copiesService: CopiesService) {}

  @Post()
  create(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() createCopyDto: CreateCopyDto,
  ) {
    return this.copiesService.create(bookId, { ...createCopyDto });
  }

  @Get()
  async findAll(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Query() CopyQueryDto: CopyQueryDto,
  ) {
    return await this.copiesService.findAll(bookId, CopyQueryDto);
  }

  @Get(':id')
  findOne(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.copiesService.findOne(bookId, id);
  }

  @Patch(':id')
  update(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCopyDto: UpdateCopyDto,
  ) {
    return this.copiesService.update(bookId, id, updateCopyDto);
  }

  @Delete(':id')
  remove(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.copiesService.remove(bookId, id);
  }
}

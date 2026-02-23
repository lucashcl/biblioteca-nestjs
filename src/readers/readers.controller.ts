import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { ReadersService } from './readers.service';
import { CreateReaderDto } from './dto/create-reader.dto';
import { UpdateReaderDto } from './dto/update-reader.dto';
import { ReaderQueryDto } from './dto/reader-query.dto';

@Controller('readers')
export class ReadersController {
  constructor(private readonly readersService: ReadersService) {}

  @Post()
  async create(@Body() createReaderDto: CreateReaderDto) {
    return await this.readersService.create(createReaderDto);
  }

  @Get()
  async findAll(@Query() ReaderQueryDto: ReaderQueryDto) {
    return await this.readersService.findAll(ReaderQueryDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const reader = await this.readersService.findOne(id);
    if (!reader) throw new NotFoundException(`Reader with id ${id} not found`);
    return reader;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReaderDto: UpdateReaderDto,
  ) {
    const reader = await this.readersService.update(id, updateReaderDto);
    if (!reader) throw new NotFoundException(`Reader with id ${id} not found`);
    return reader;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const reader = await this.readersService.remove(id);
    if (!reader) throw new NotFoundException(`Reader with id ${id} not found`);
    return reader;
  }
}

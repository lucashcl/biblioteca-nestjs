import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  Patch,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { PaginationQueryDto } from '../common/pagination/pagination-query.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.booksService.findAll(paginationQueryDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const book = await this.booksService.findOne(id);
    if (!book) throw new NotFoundException(`Book with id ${id} not found`);
    return book;
  }

  @Get('isbn/:isbn')
  async findByIsbn(@Param('isbn') isbn: string) {
    const book = await this.booksService.findByIsbn(isbn);
    if (!book) throw new NotFoundException(`Book with ISBN ${isbn} not found`);
    return book;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    const book = await this.booksService.update(id, updateBookDto);
    if (!book) throw new NotFoundException(`Book with id ${id} not found`);
    return book;
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const book = await this.booksService.delete(id);
    if (!book) throw new NotFoundException(`Book with id ${id} not found`);
    return book;
  }
}

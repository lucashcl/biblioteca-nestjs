import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoanQueryDto } from './dto/loan-query.dto';
import { BorrowCopyDto } from './dto/borrow-copy.dto';
import { ReturnCopyDto } from './dto/return-copy.dto';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post('borrow')
  async borrow(@Body() BorrowCopyDto: BorrowCopyDto) {
    return await this.loansService.borrow(BorrowCopyDto);
  }

  @Post(':id/return')
  async return(
    @Param('id', ParseIntPipe) id: number,
    @Body() returnCopyDto: ReturnCopyDto,
  ) {
    return await this.loansService.return(id, returnCopyDto);
  }

  @Get()
  async findAll(@Query() loanQueryDto: LoanQueryDto) {
    return await this.loansService.findAll(loanQueryDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.loansService.findOne(id);
  }

  @Delete(':id/cancel')
  async cancel(@Param('id', ParseIntPipe) id: number) {
    return await this.loansService.cancel(id);
  }
}

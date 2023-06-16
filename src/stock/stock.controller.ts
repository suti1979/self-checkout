import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { Stock } from './entities/stock.entity';

@ApiTags('Stock')
@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) {}

  @Get()
  async getStock() {
    return await this.stockService.getStock();
  }

  @Post()
  async updateStock(@Body() body: Stock) {
    return await this.stockService.createStock(body);
  }
}

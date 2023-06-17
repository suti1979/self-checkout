import { Body, Controller, Get, Param, Patch, Post, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { Stock } from './entities/stock.entity';
import { CheckoutDto } from './dto/checkout.dto';
import { CustomExceptionFilter } from './exception.filter';

@ApiTags('Stock')
@Controller('api/v1')
export class StockController {
  constructor(private stockService: StockService) {}

  @Get('stock')
  async getStock() {
    return await this.stockService.getStock();
  }

  @Post('stock')
  async updateStock(@Body() body: Stock) {
    return await this.stockService.createStock(body);
  }

  @Patch('stock/:id')
  async createStock(@Param('id') id: string, @Body() body: Stock) {
    return await this.stockService.updateStock(id, body);
  }

  @Post('checkout/:id')
  @UseFilters(CustomExceptionFilter)
  async checkout(@Param('id') id: string, @Body() body: CheckoutDto) {
    return await this.stockService.checkout(id, body);
  }
}

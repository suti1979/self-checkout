import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { Stock } from './entities/stock.entity';
import { CheckoutDto } from './dto/checkout.dto';
import { CustomExceptionFilter } from './exception.filter';

@ApiTags('Stock')
@Controller('api/v1')
export class StockController {
  constructor(private stockService: StockService) {}

  @Get('stock')
  @ApiOperation({ summary: 'Get all Stocks' })
  async getAllStock() {
    return await this.stockService.getAllStock();
  }

  @Get('stock/:id')
  @ApiOperation({ summary: 'Get Stock by id' })
  @ApiNotFoundResponse()
  async getStockbyId(@Param('id') id: string) {
    const stock = await this.stockService.getStockById(id);
    if (!stock) throw new NotFoundException(`Stock #${id} not found`);
    return stock;
  }

  @Post('stock')
  @ApiCreatedResponse({ type: Stock })
  @ApiOperation({ summary: 'Create Stock' })
  async createStock(@Body() body: Stock) {
    return await this.stockService.createStock(body);
  }

  @Patch('stock/:id')
  @ApiOperation({ summary: 'Update Stock' })
  @ApiNotFoundResponse()
  async updateStock(@Param('id') id: string, @Body() body: Stock) {
    const stock = await this.stockService.getStockById(id);
    if (!stock) throw new NotFoundException(`Stock #${id} not found`);

    return await this.stockService.updateStock(id, body);
  }

  @Post('checkout/:id')
  @ApiOperation({ summary: 'Checkout stock' })
  @UseFilters(CustomExceptionFilter)
  async checkout(@Param('id') id: string, @Body() body: CheckoutDto) {
    const stock = await this.stockService.getStockById(id);
    if (!stock) throw new NotFoundException(`Stock #${id} not found`);

    return await this.stockService.checkout(id, body);
  }
}

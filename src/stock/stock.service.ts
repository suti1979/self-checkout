import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock) private stockRepository: Repository<Stock>,
  ) {}

  async getStock(): Promise<Stock[]> {
    return await this.stockRepository.find();
  }

  async createStock(stock: Stock): Promise<Stock> {
    return await this.stockRepository.save(stock);
  }

  async updateStock(stock: Stock): Promise<Stock> {
    return await this.stockRepository.save(stock);
  }
}

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

  async getStockById(id: string): Promise<Stock> {
    return await this.stockRepository.findOneBy({ id: id });
  }

  async createStock(stock: Stock): Promise<Stock> {
    return await this.stockRepository.save(stock);
  }

  async updateStock(id: string, stock: Stock): Promise<Stock> {
    const stockToUpdate = await this.getStockById(id);
    stockToUpdate.data = stock.data;
    return await this.stockRepository.save(stockToUpdate);
  }
}

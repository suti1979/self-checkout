import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock, TransactionData } from './entities/stock.entity';
import { Repository } from 'typeorm';
import { CheckoutDto } from './dto/checkout.dto';
import { calculateGiveBack } from '../lib/calculateGiveBack';

@Injectable()
export class StockService {
  constructor(@InjectRepository(Stock) private stockRepository: Repository<Stock>) {}

  async getAllStock(): Promise<Stock[]> {
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
    stockToUpdate.data = { ...stockToUpdate.data, ...stock.data };

    return await this.stockRepository.save(stockToUpdate);
  }

  async checkout(id: string, checkout: CheckoutDto): Promise<TransactionData> {
    const stockToUpdate = await this.getStockById(id);
    const giveBack = calculateGiveBack(checkout.inserted, checkout.price, stockToUpdate.data);

    Object.keys(giveBack).forEach((key) => {
      stockToUpdate.data[key] -= giveBack[key];
    });
    await this.stockRepository.save(stockToUpdate);

    return giveBack;
  }
}

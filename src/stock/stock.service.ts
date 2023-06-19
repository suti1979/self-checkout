import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock, TransactionData } from './entities/stock.entity';
import { Repository } from 'typeorm';
import { CheckoutDto } from './dto/checkout.dto';
import { calculateGiveBack } from '../lib/calculateGiveBack';
import axios from 'axios';

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
    if (!stockToUpdate) throw new NotFoundException(`Stock #${id} not found`);
    stockToUpdate.data = { ...stockToUpdate.data, ...stock.data };

    return await this.stockRepository.save(stockToUpdate);
  }

  async checkout(id: string, checkout: CheckoutDto, eur: boolean): Promise<TransactionData> {
    const stockToUpdate = await this.getStockById(id);
    if (!stockToUpdate) throw new NotFoundException(`Stock #${id} not found`);

    let eurHufValue = null;
    if (eur) {
      eurHufValue = await this.getEurHufValue();
    }

    const giveBack = calculateGiveBack(
      checkout.inserted,
      checkout.price,
      stockToUpdate.data,
      eurHufValue,
    );

    Object.keys(giveBack).forEach((key) => {
      stockToUpdate.data[key] -= giveBack[key];
    });
    await this.stockRepository.save(stockToUpdate);

    return giveBack;
  }

  async getEurHufValue(): Promise<number> {
    const response = await axios.get('https://eurhuf.vercel.app/api');
    return parseFloat(response.data.value);
  }
}

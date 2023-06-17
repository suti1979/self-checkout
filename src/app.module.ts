import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './db/ormconfig';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [TypeOrmModule.forRoot(config), StockModule],
})
export class AppModule {}

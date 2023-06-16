import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './db/ormconfig';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [TypeOrmModule.forRoot(config), StockModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

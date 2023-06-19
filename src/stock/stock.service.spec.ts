import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StockService } from './stock.service';
import { Stock } from './entities/stock.entity';
import { StockController } from './stock.controller';
import { NotFoundException } from '@nestjs/common';

describe('StockService', () => {
  let stockService: StockService;
  let stockRepository: Repository<Stock>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [StockController],
      providers: [
        StockService,
        {
          provide: getRepositoryToken(Stock),
          useClass: Repository,
          useValue: {
            // getAllStock: jest.fn(),
            // getStockById: jest.fn(),
          },
        },
      ],
    }).compile();

    stockService = moduleRef.get<StockService>(StockService);
    stockRepository = moduleRef.get<Repository<Stock>>(getRepositoryToken(Stock));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(stockService).toBeDefined();
  });
});

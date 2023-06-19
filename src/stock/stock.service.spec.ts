import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StockService } from './stock.service';
import { Stock } from './entities/stock.entity';
import { Repository } from 'typeorm';
import axios from 'axios';

describe('StockService', () => {
  let stockService: StockService;
  let stockRepositoryMock: any;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        StockService,
        {
          provide: getRepositoryToken(Stock),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    stockService = moduleRef.get<StockService>(StockService);
    stockRepositoryMock = moduleRef.get<Repository<Stock>>(getRepositoryToken(Stock));
  });

  describe('getAllStock', () => {
    it('should return an array of stocks', async () => {
      const mockStocks = [
        { id: '1', data: {} },
        { id: '2', data: {} },
      ];
      stockRepositoryMock.find.mockResolvedValue(mockStocks);
      const result = await stockService.getAllStock();

      expect(result).toEqual(mockStocks);
    });
  });

  describe('getStockById', () => {
    it('should return the stock with the specified id', async () => {
      const mockStockId = '1';
      const mockStock = { id: '1', data: {} };
      stockRepositoryMock.findOneBy.mockResolvedValue(mockStock);
      const result = await stockService.getStockById(mockStockId);

      expect(result).toEqual(mockStock);
    });

    it('should return null if no stock is found with the specified id', async () => {
      const mockStockId = '1';
      stockRepositoryMock.findOneBy.mockResolvedValue(null);
      const result = await stockService.getStockById(mockStockId);

      expect(result).toBeNull();
    });
  });

  describe('createStock', () => {
    it('should create and return a new stock', async () => {
      const mockStock = { id: '1', data: {} };
      stockRepositoryMock.save.mockResolvedValue(mockStock);
      const result = await stockService.createStock(mockStock);

      expect(result).toEqual(mockStock);
    });
  });

  describe('updateStock', () => {
    it('should update and return the updated stock', async () => {
      const mockStockId = '1';
      const mockStock = { id: '1', data: {} };
      jest.spyOn(stockRepositoryMock, 'findOneBy').mockResolvedValue(mockStock);
      jest.spyOn(stockRepositoryMock, 'save').mockResolvedValue(mockStock);

      const updatedStockData = { id: '1', data: {} };
      const result = await stockService.updateStock(mockStockId, updatedStockData);

      expect(result).toEqual(mockStock);
      expect(stockRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: mockStockId });
      expect(stockRepositoryMock.save).toHaveBeenCalledWith(mockStock);
    });
  });

  describe('checkout', () => {
    it('should checkout and return the giveBack data', async () => {
      const mockStockId = '1';
      const mockStockData = { id: mockStockId, data: { '100': 100 } };
      jest.spyOn(stockRepositoryMock, 'findOneBy').mockResolvedValue(mockStockData);
      jest.spyOn(stockRepositoryMock, 'save').mockResolvedValue(mockStockData);

      // Mock the getEurHufValue method to return a specific value
      jest.spyOn(stockService, 'getEurHufValue').mockResolvedValue(350);

      const mockGiveBackData = { '100': 5 };

      const mockCheckoutDto = { inserted: { '10': 1 }, price: 3000 };
      const result = await stockService.checkout(mockStockId, mockCheckoutDto, true);

      expect(result).toEqual(mockGiveBackData);
      expect(stockRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: mockStockId });
      expect(stockRepositoryMock.save).toHaveBeenCalledWith(mockStockData);
      expect(stockService.getEurHufValue).toHaveBeenCalled();
    });
  });

  describe('StockService', () => {
    it('should return the EUR/HUF value', async () => {
      const mockResponse = { data: { value: '350' } };
      jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);

      const result = await stockService.getEurHufValue();

      expect(axios.get).toHaveBeenCalledWith('https://eurhuf.vercel.app/api');
      expect(result).toBe(350);
    });

    it('should throw an error if there is an issue with the API', async () => {
      jest.spyOn(axios, 'get').mockRejectedValue(new Error('API error'));
      await expect(stockService.getEurHufValue()).rejects.toThrowError('API error');

      expect(axios.get).toHaveBeenCalledWith('https://eurhuf.vercel.app/api');
    });
  });
});

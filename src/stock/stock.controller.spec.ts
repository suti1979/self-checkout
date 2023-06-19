import { Test } from '@nestjs/testing';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { NotFoundException } from '@nestjs/common';

describe('StockController', () => {
  let stockController: StockController;
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
        },
      ],
    }).compile();

    stockController = moduleRef.get<StockController>(StockController);
    stockService = moduleRef.get<StockService>(StockService);
    stockRepository = moduleRef.get<Repository<Stock>>(getRepositoryToken(Stock));
  });

  describe('getAllStock', () => {
    it('should return all stocks', async () => {
      const mockStocks: Stock[] = [
        { id: '1', data: { key1: 10, key2: 20 } },
        { id: '2', data: { key3: 30, key4: 40 } },
      ];
      jest.spyOn(stockRepository, 'find').mockResolvedValue(mockStocks);

      const result = await stockController.getAllStock();
      expect(result).toEqual(mockStocks);
    });
  });

  describe('getStockbyId', () => {
    it('should return the stock with the specified id', async () => {
      const mockStockId = '1';
      const mockStock = { id: '1', data: { key1: 10, key2: 20 } };
      jest.spyOn(stockService, 'getStockById').mockResolvedValue(mockStock);

      const result = await stockController.getStockbyId(mockStockId);
      expect(result).toEqual(mockStock);
    });

    it('should throw NotFoundException when stock with the specified id is not found', async () => {
      const mockStockId = '1';
      jest.spyOn(stockService, 'getStockById').mockResolvedValue(null);

      let error: NotFoundException;
      try {
        await stockController.getStockbyId(mockStockId);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`Stock #${mockStockId} not found`);
    });
  });

  describe('createStock', () => {
    it('should create a new stock', async () => {
      const mockStock = { id: '1', data: { key1: 10, key2: 20 } };
      jest.spyOn(stockService, 'createStock').mockResolvedValue(mockStock);

      const result = await stockController.createStock(mockStock);

      expect(result).toEqual(mockStock);
    });
  });

  describe('updateStock', () => {
    it('should update the stock with the specified id', async () => {
      // Mock the stockService's getStockById and updateStock methods
      const mockStockId = '1';
      const mockStockToUpdate = { id: '1', data: { key1: 10, key2: 20 } };
      const mockUpdatedStock = { id: '1', data: { key1: 10, key2: 20, key3: 30 } };

      jest.spyOn(stockService, 'getStockById').mockResolvedValue(mockStockToUpdate);
      jest.spyOn(stockService, 'updateStock').mockResolvedValue(mockUpdatedStock);

      // Call the updateStock method on the stockController with the mock stock id and updated stock
      const result = await stockController.updateStock(mockStockId, mockUpdatedStock);

      // Expect the result to match the updated stock
      expect(result).toEqual(mockUpdatedStock);
    });

    it('should throw NotFoundException when stock with the specified id is not found', async () => {
      // Mock the stockService's getStockById method to return null
      const mockStockId = '1';
      const mockUpdatedStock = { id: '1', data: { key1: 10, key2: 20 } };

      jest.spyOn(stockService, 'getStockById').mockResolvedValue(null);

      // Call the updateStock method on the stockController with the mock stock id and updated stock
      let error: NotFoundException;
      try {
        await stockController.updateStock(mockStockId, mockUpdatedStock);
      } catch (e) {
        error = e;
      }

      // Expect a NotFoundException to be thrown
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`Stock #${mockStockId} not found`);
    });
  });

  describe('checkout', () => {
    it('should checkout the stock with the specified id and return the give back data', async () => {
      // Mock the stockService's getStockById and checkout methods
      const mockStockId = '1';
      const mockStock = { id: '1', data: { key1: 10, key2: 20 } };
      const mockCheckoutDto = { inserted: { key1: 10, key2: 20 }, price: 5 };
      const mockGiveBack = { key1: 5 };

      jest.spyOn(stockService, 'getStockById').mockResolvedValue(mockStock);
      jest.spyOn(stockService, 'checkout').mockResolvedValue(mockGiveBack);

      // Call the checkout method on the stockController with the mock stock id and checkout DTO
      const result = await stockController.checkout(mockStockId, mockCheckoutDto);

      // Expect the result to match the mock give back data
      expect(result).toEqual(mockGiveBack);
    });

    it('should throw NotFoundException when stock with the specified id is not found', async () => {
      // Mock the stockService's getStockById method to return null
      const mockStockId = '1';
      const mockCheckoutDto = { inserted: { key1: 10, key2: 20 }, price: 5 };

      jest.spyOn(stockService, 'getStockById').mockResolvedValue(null);

      // Call the checkout method on the stockController with the mock stock id and checkout DTO
      let error: NotFoundException;
      try {
        await stockController.checkout(mockStockId, mockCheckoutDto);
      } catch (e) {
        error = e;
      }

      // Expect a NotFoundException to be thrown
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe(`Stock #${mockStockId} not found`);
    });
  });
});

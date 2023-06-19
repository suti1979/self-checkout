import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StockService } from './stock.service';
import { Stock } from './entities/stock.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

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
      const mockStockData = { id: mockStockId, data: { '10': 10 } };
      jest.spyOn(stockRepositoryMock, 'findOneBy').mockResolvedValue(mockStockData);
      jest.spyOn(stockRepositoryMock, 'save').mockResolvedValue(mockStockData);

      const mockGiveBackData = { '10': 1 };
      const calculateGiveBackMock = jest.fn().mockReturnValue(mockGiveBackData);

      const mockCheckoutDto = { inserted: { '20': 1 }, price: 10 };

      const result = await stockService.checkout(mockStockId, mockCheckoutDto);

      expect(result).toEqual(mockGiveBackData);

      expect(stockRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: mockStockId });

      // expect(calculateGiveBackMock).toHaveBeenCalledWith(
      //   mockCheckoutDto.inserted,
      //   mockCheckoutDto.price,
      //   mockStockData.data,
      // );

      expect(stockRepositoryMock.save).toHaveBeenCalledWith(mockStockData);

      //expect(mockStockData.data).toEqual({ '10': 1 });
    });

    // it('should throw a NotFoundException if the stock is not found', async () => {
    //   // Mock the stockRepository's findOne method to return null
    //   const mockStockId = '1';
    //   jest.spyOn(stockRepositoryMock, 'findOneBy').mockResolvedValue(null);

    //   // Mock the CheckoutDto
    //   const mockCheckoutDto = { inserted: { key: 5 }, price: 10 };

    //   // Expect the checkout method to throw a NotFoundException
    //   await expect(stockService.checkout(mockStockId, mockCheckoutDto)).rejects.toThrowError(
    //     NotFoundException,
    //   );

    //   // Verify that the stockRepository's findOne method was called with the correct parameters
    //   expect(stockRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: mockStockId });

    //   // Verify that the stockRepository's save method was not called
    //   expect(stockRepositoryMock.save).not.toHaveBeenCalled();
    // });
  });
});

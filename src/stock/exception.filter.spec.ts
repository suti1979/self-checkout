import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, HttpException } from '@nestjs/common';
import { CustomExceptionFilter } from './exception.filter';

const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));

const mockArgumentsHost = {
  switchToHttp: jest.fn().mockImplementation(() => ({
    getResponse: mockGetResponse,
  })),
};

describe('CustomExceptionFilter', () => {
  let filter: CustomExceptionFilter;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomExceptionFilter],
    }).compile();
    filter = module.get<CustomExceptionFilter>(CustomExceptionFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('Http exception', () => {
    const exception = new HttpException('Http exception', HttpStatus.BAD_REQUEST);
    filter.catch(exception, mockArgumentsHost as any);
    expect(mockArgumentsHost.switchToHttp).toHaveBeenCalled();
    expect(mockGetResponse).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Http exception',
    });
  });

  it('Internal server error', () => {
    const exception = new Error('Internal error');
    filter.catch(exception, mockArgumentsHost as any);
    expect(mockArgumentsHost.switchToHttp).toHaveBeenCalled();
    expect(mockGetResponse).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal error',
    });
  });
  it('Error with object message containing error key', () => {
    const exception = new Error('Custom error');
    (exception as any).message = { error: 'Custom error' };
    filter.catch(exception, mockArgumentsHost as any);
    expect(mockArgumentsHost.switchToHttp).toHaveBeenCalled();
    expect(mockGetResponse).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Custom error',
    });
  });
  it('Error with undefined message', () => {
    const exception = new Error();
    (exception as any).message = undefined;
    filter.catch(exception, mockArgumentsHost as any);
    expect(mockArgumentsHost.switchToHttp).toHaveBeenCalled();
    expect(mockGetResponse).toHaveBeenCalled();
    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal error',
    });
  });
});

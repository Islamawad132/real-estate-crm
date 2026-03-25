import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller.js';
import { InvoicesService } from './invoices.service.js';
import { InvoiceStatus, PaymentMethod } from '@prisma/client';

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  recordPayment: jest.fn(),
  cancel: jest.fn(),
  findOverdue: jest.fn(),
  findUpcoming: jest.fn(),
  getStats: jest.fn(),
};

const sampleInvoice = {
  id: 'invoice-uuid-001',
  contractId: 'contract-uuid-001',
  invoiceNumber: 'INV-2026-0001',
  amount: 50000,
  dueDate: new Date('2026-04-01'),
  paidDate: null,
  status: InvoiceStatus.PENDING,
  paymentMethod: null,
  notes: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('InvoicesController', () => {
  let controller: InvoicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [{ provide: InvoicesService, useValue: mockService }],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an invoice', async () => {
      mockService.create.mockResolvedValue(sampleInvoice);

      const dto = {
        contractId: 'contract-uuid-001',
        amount: 50000,
        dueDate: '2026-04-01',
      };

      const result = await controller.create(dto as any);
      expect(result).toEqual(sampleInvoice);
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return paginated invoices', async () => {
      const paginated = {
        data: [sampleInvoice],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      };
      mockService.findAll.mockResolvedValue(paginated);

      const result = await controller.findAll({} as any);
      expect(result).toEqual(paginated);
      expect(mockService.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('getStats', () => {
    it('should return payment statistics', async () => {
      const stats = {
        total: 20,
        totalDue: 200000,
        totalCollected: 150000,
        totalOverdue: 30000,
        byStatus: {},
      };
      mockService.getStats.mockResolvedValue(stats);

      const result = await controller.getStats();
      expect(result.total).toBe(20);
      expect(result.totalCollected).toBe(150000);
      expect(mockService.getStats).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOverdue', () => {
    it('should return overdue invoices', async () => {
      const overdueList = [{ ...sampleInvoice, dueDate: new Date('2025-01-01') }];
      mockService.findOverdue.mockResolvedValue(overdueList);

      const result = await controller.findOverdue();
      expect(result).toEqual(overdueList);
      expect(mockService.findOverdue).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUpcoming', () => {
    it('should return upcoming invoices with default 30 days', async () => {
      mockService.findUpcoming.mockResolvedValue([sampleInvoice]);

      const result = await controller.findUpcoming(undefined);
      expect(result).toHaveLength(1);
      expect(mockService.findUpcoming).toHaveBeenCalledWith(30);
    });

    it('should pass custom days to service', async () => {
      mockService.findUpcoming.mockResolvedValue([]);

      await controller.findUpcoming('7');
      expect(mockService.findUpcoming).toHaveBeenCalledWith(7);
    });
  });

  describe('findOne', () => {
    it('should return an invoice by ID', async () => {
      const withContract = {
        ...sampleInvoice,
        contract: { id: 'contract-uuid-001', type: 'SALE', property: {}, client: {} },
      };
      mockService.findOne.mockResolvedValue(withContract);

      const result = await controller.findOne(sampleInvoice.id);
      expect(result.id).toBe(sampleInvoice.id);
      expect(mockService.findOne).toHaveBeenCalledWith(sampleInvoice.id);
    });
  });

  describe('update', () => {
    it('should update an invoice', async () => {
      const updated = { ...sampleInvoice, amount: 60000 };
      mockService.update.mockResolvedValue(updated);

      const result = await controller.update(sampleInvoice.id, { amount: 60000 });
      expect(result.amount).toBe(60000);
      expect(mockService.update).toHaveBeenCalledWith(sampleInvoice.id, { amount: 60000 });
    });
  });

  describe('recordPayment', () => {
    it('should record a payment', async () => {
      const paid = {
        ...sampleInvoice,
        status: InvoiceStatus.PAID,
        paidDate: new Date('2026-03-25'),
        paymentMethod: PaymentMethod.BANK_TRANSFER,
      };
      mockService.recordPayment.mockResolvedValue(paid);

      const dto = {
        paidDate: '2026-03-25',
        paymentMethod: PaymentMethod.BANK_TRANSFER,
      };

      const result = await controller.recordPayment(sampleInvoice.id, dto as any);
      expect(result.status).toBe(InvoiceStatus.PAID);
      expect(mockService.recordPayment).toHaveBeenCalledWith(sampleInvoice.id, dto);
    });
  });

  describe('cancel', () => {
    it('should cancel an invoice', async () => {
      const cancelled = { ...sampleInvoice, status: InvoiceStatus.CANCELLED };
      mockService.cancel.mockResolvedValue(cancelled);

      const result = await controller.cancel(sampleInvoice.id);
      expect(result.status).toBe(InvoiceStatus.CANCELLED);
      expect(mockService.cancel).toHaveBeenCalledWith(sampleInvoice.id);
    });
  });
});

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, InvoiceStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateInvoiceDto } from './dto/create-invoice.dto.js';
import { UpdateInvoiceDto } from './dto/update-invoice.dto.js';
import { InvoiceFilterDto } from './dto/invoice-filter.dto.js';
import { RecordPaymentDto } from './dto/record-payment.dto.js';
import { paginate, PaginatedResult } from '../common/dto/pagination.dto.js';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private async ensureInvoiceExists(id: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID "${id}" not found`);
    }
    return invoice;
  }

  /**
   * Generate a sequential invoice number in the format INV-YYYY-NNNN.
   * Counts existing invoices for the current year and increments.
   */
  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const yearStart = new Date(`${year}-01-01T00:00:00.000Z`);
    const yearEnd = new Date(`${year + 1}-01-01T00:00:00.000Z`);

    const count = await this.prisma.invoice.count({
      where: {
        createdAt: { gte: yearStart, lt: yearEnd },
      },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `INV-${year}-${sequence}`;
  }

  // ─── CRUD ────────────────────────────────────────────────────────────────

  async create(dto: CreateInvoiceDto) {
    // Validate contract exists
    const contract = await this.prisma.contract.findUnique({
      where: { id: dto.contractId },
    });
    if (!contract) {
      throw new NotFoundException(`Contract with ID "${dto.contractId}" not found`);
    }

    const invoiceNumber = await this.generateInvoiceNumber();

    return this.prisma.invoice.create({
      data: {
        contractId: dto.contractId,
        invoiceNumber,
        amount: dto.amount,
        dueDate: new Date(dto.dueDate),
        notes: dto.notes,
        status: InvoiceStatus.PENDING,
      },
      include: {
        contract: {
          select: {
            id: true,
            type: true,
            status: true,
            totalAmount: true,
            property: { select: { id: true, title: true, city: true } },
            client: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });
  }

  async findAll(filter: InvoiceFilterDto): Promise<PaginatedResult<unknown>> {
    const where: Prisma.InvoiceWhereInput = {};

    if (filter.status) where.status = filter.status;
    if (filter.contractId) where.contractId = filter.contractId;

    if (filter.dateFrom || filter.dateTo) {
      where.dueDate = {};
      if (filter.dateFrom) where.dueDate.gte = new Date(filter.dateFrom);
      if (filter.dateTo) where.dueDate.lte = new Date(filter.dateTo);
    }

    // Overdue: pending invoices whose due date has passed
    if (filter.overdue === 'true') {
      where.status = InvoiceStatus.PENDING;
      where.dueDate = { ...(where.dueDate as object), lt: new Date() };
    }

    if (filter.search) {
      where.OR = [
        { invoiceNumber: { contains: filter.search, mode: 'insensitive' } },
        { notes: { contains: filter.search, mode: 'insensitive' } },
        {
          contract: {
            property: { title: { contains: filter.search, mode: 'insensitive' } },
          },
        },
      ];
    }

    const sortField = filter.sortBy ?? 'dueDate';
    const allowedSortFields = ['createdAt', 'dueDate', 'amount'];
    const orderBy: Prisma.InvoiceOrderByWithRelationInput = allowedSortFields.includes(sortField)
      ? { [sortField]: filter.sortOrder ?? 'asc' }
      : { dueDate: 'asc' };

    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        orderBy,
        skip: filter.skip,
        take: filter.limit,
        include: {
          contract: {
            select: {
              id: true,
              type: true,
              status: true,
              property: { select: { id: true, title: true, city: true } },
              client: { select: { id: true, firstName: true, lastName: true } },
            },
          },
        },
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return paginate(data, total, filter);
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        contract: {
          include: {
            property: { select: { id: true, title: true, type: true, city: true, address: true } },
            client: { select: { id: true, firstName: true, lastName: true, phone: true, email: true } },
          },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID "${id}" not found`);
    }

    return invoice;
  }

  async update(id: string, dto: UpdateInvoiceDto) {
    const invoice = await this.ensureInvoiceExists(id);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Cannot update a paid invoice');
    }

    if (invoice.status === InvoiceStatus.CANCELLED) {
      throw new BadRequestException('Cannot update a cancelled invoice');
    }

    return this.prisma.invoice.update({
      where: { id },
      data: {
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.dueDate !== undefined && { dueDate: new Date(dto.dueDate) }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    });
  }

  // ─── Status transitions ───────────────────────────────────────────────────

  async recordPayment(id: string, dto: RecordPaymentDto) {
    const invoice = await this.ensureInvoiceExists(id);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice is already paid');
    }

    if (invoice.status === InvoiceStatus.CANCELLED) {
      throw new BadRequestException('Cannot pay a cancelled invoice');
    }

    return this.prisma.invoice.update({
      where: { id },
      data: {
        status: InvoiceStatus.PAID,
        paidDate: new Date(dto.paidDate),
        paymentMethod: dto.paymentMethod,
        notes: dto.notes !== undefined ? dto.notes : invoice.notes,
      },
    });
  }

  async cancel(id: string) {
    const invoice = await this.ensureInvoiceExists(id);

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Cannot cancel a paid invoice');
    }

    if (invoice.status === InvoiceStatus.CANCELLED) {
      throw new BadRequestException('Invoice is already cancelled');
    }

    return this.prisma.invoice.update({
      where: { id },
      data: { status: InvoiceStatus.CANCELLED },
    });
  }

  // ─── Specialised queries ──────────────────────────────────────────────────

  async findOverdue(): Promise<unknown[]> {
    return this.prisma.invoice.findMany({
      where: {
        status: InvoiceStatus.PENDING,
        dueDate: { lt: new Date() },
      },
      orderBy: { dueDate: 'asc' },
      include: {
        contract: {
          select: {
            id: true,
            type: true,
            property: { select: { id: true, title: true, city: true } },
            client: { select: { id: true, firstName: true, lastName: true, phone: true } },
          },
        },
      },
    });
  }

  async findUpcoming(days = 30): Promise<unknown[]> {
    const now = new Date();
    const future = new Date();
    future.setDate(future.getDate() + days);

    return this.prisma.invoice.findMany({
      where: {
        status: InvoiceStatus.PENDING,
        dueDate: { gte: now, lte: future },
      },
      orderBy: { dueDate: 'asc' },
      include: {
        contract: {
          select: {
            id: true,
            type: true,
            property: { select: { id: true, title: true, city: true } },
            client: { select: { id: true, firstName: true, lastName: true, phone: true } },
          },
        },
      },
    });
  }

  async getStats() {
    const now = new Date();

    const [
      totalInvoices,
      totalDue,
      totalCollected,
      totalOverdue,
      byStatus,
    ] = await Promise.all([
      this.prisma.invoice.count(),
      // Total pending (not yet paid, not cancelled)
      this.prisma.invoice.aggregate({
        _sum: { amount: true },
        where: { status: InvoiceStatus.PENDING },
      }),
      // Total collected (paid)
      this.prisma.invoice.aggregate({
        _sum: { amount: true },
        where: { status: InvoiceStatus.PAID },
      }),
      // Total overdue amount
      this.prisma.invoice.aggregate({
        _sum: { amount: true },
        where: {
          status: InvoiceStatus.PENDING,
          dueDate: { lt: now },
        },
      }),
      this.prisma.invoice.groupBy({
        by: ['status'],
        _count: { id: true },
        _sum: { amount: true },
      }),
    ]);

    return {
      total: totalInvoices,
      totalDue: totalDue._sum.amount ?? 0,
      totalCollected: totalCollected._sum.amount ?? 0,
      totalOverdue: totalOverdue._sum.amount ?? 0,
      byStatus: Object.fromEntries(
        byStatus.map((s) => [
          s.status,
          { count: s._count.id, amount: s._sum.amount ?? 0 },
        ]),
      ),
    };
  }
}

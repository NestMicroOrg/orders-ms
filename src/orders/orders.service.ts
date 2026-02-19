import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class OrdersService {

  constructor(private prisma: PrismaService) { }

  async create(createOrderDto: CreateOrderDto) {

    const { status, ...rest } = createOrderDto;

    const order = await this.prisma.order.create({
      data: {
        ...rest,
        status: status || 'PENDING',
      }
    });
    return order;
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }
}

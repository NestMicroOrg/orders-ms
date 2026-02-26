import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ChangeOrderStatusDto, OrderPaginationDto } from './dto';
import { OrderStatus } from 'generated/prisma/enums';
import { PRODUCT_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {

  constructor(
    private prisma: PrismaService,
    @Inject(PRODUCT_SERVICE) private readonly productClient: ClientProxy
  ) { }

  async create(createOrderDto: CreateOrderDto) {

    const ids = [6, 7]

    const products = await firstValueFrom(
      this.productClient.send({ cmd: 'validate_product' }, ids)
    )

    return products;

    // const { status, ...rest } = createOrderDto;

    // const order = await this.prisma.order.create({
    //   data: {
    //     ...rest,
    //     status: status || 'PENDING',
    //   }
    // });
    // return order;
  }

  async findAll(paginationDto: OrderPaginationDto) {
    const { page = 1, limit = 10, status } = paginationDto;

    const totalOrders = await this.prisma.order.count({
      where: {
        status
      }
    });
    const lastPage = Math.ceil(totalOrders / limit);

    return {
      data: await this.prisma.order.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          status
        }
      }),
      meta: {
        totalOrders,
        page,
        lastPage
      }
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id }
    });
    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`
      });
    }
    return order;
  }

  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {

    const { id, status } = changeOrderStatusDto;

    const order = await this.findOne(id);

    if (order.status === status) {
      return order;
    }

    return await this.prisma.order.update({
      where: { id },
      data: { status }
    });
  }
}

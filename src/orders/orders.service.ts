import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ChangeOrderStatusDto, OrderPaginationDto } from './dto';
import { OrderStatus } from 'generated/prisma/enums';
import { PRODUCT_SERVICE } from 'src/config';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {

  constructor(
    private prisma: PrismaService,
    @Inject(PRODUCT_SERVICE) private readonly productClient: ClientProxy
  ) { }

  async create(createOrderDto: CreateOrderDto) {


    // 1. Validate products
    const productIds = createOrderDto.items.map(item => item.productId);
    const products: any[] = await firstValueFrom(
      this.productClient.send({ cmd: 'validate_product' }, { productIds })
        .pipe(catchError(err => { throw new RpcException(err) }))
    );

    // 2. Calculate totals
    const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
      const price = products.find(
        product => product.id === orderItem.productId
      ).price;

      return acc + price * orderItem.quantity;
    }, 0);

    const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
      return acc + orderItem.quantity;
    }, 0);

    // 3. Create db transaction
    const order = await this.prisma.order.create({
      data: {
        totalAmount,
        totalItems,
        orderItems: {
          createMany: {
            data: createOrderDto.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: products.find(p => p.id === item.productId).price
            }))
          }
        }
      },
      include: {
        orderItems: {
          select: {
            productId: true,
            quantity: true,
            price: true
          }
        }
      }
    });

    return order;


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

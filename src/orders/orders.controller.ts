import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaginationDto } from 'src/common';
import { OrderPaginationDto } from './dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @MessagePattern('createOrder')
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern('findAllOrders')
  findAll(@Payload() paginationDto: OrderPaginationDto) {
    return this.ordersService.findAll(paginationDto);
  }

  @MessagePattern('findOneOrder')
  findOne(@Payload('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern('changeOrderStatus')
  changeOrderStatus(@Payload() payload: any) {
    //return this.ordersService.changeOrderStatus(payload.id, payload.status);
  }
}

import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @MessagePattern('createOrder')
  create(@Payload() createOrderDto: CreateOrderDto) {
    console.log('Received createOrder message with payload:', createOrderDto);
    return this.ordersService.create(createOrderDto);
  }
  // @MessagePattern('createOrder')
  // create(@Payload() data: any) {
  //   console.log('Received:', data);
  //   return { ok: true };
  // }

  @MessagePattern('findAllOrders')
  findAll() {
    return this.ordersService.findAll();
  }

  @MessagePattern('findOneOrder')
  findOne(@Payload('id') id: number) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern('changeOrderStatus')
  changeOrderStatus(@Payload() payload: any) {
    //return this.ordersService.changeOrderStatus(payload.id, payload.status);
  }
}

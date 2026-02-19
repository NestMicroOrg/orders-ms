import { IsEnum, IsUUID } from "class-validator";
import { OrderStatus } from "generated/prisma/enums";
import { OrderStatusList } from "../enum/order.enum";

export class ChangeOrderStatusDto {

    @IsUUID('4', { message: "The id must be a valid UUID" })
    id: string;

    @IsEnum(OrderStatusList, {
        message: `The status must be one of the following values: ${Object.values(OrderStatusList).join(', ')}`
    })
    status: OrderStatus;
}
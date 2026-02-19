import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive } from "class-validator";
import { OrderStatus } from "generated/prisma/enums";
import { OrderStatusList } from "../enum/order.enum";
import { Type } from "class-transformer";

export class CreateOrderDto {

    @IsNumber({}, { message: "Total amount must be a number" })
    @IsPositive({ message: "Total amount must be a positive number" })
    @Type(() => Number)
    totalAmount: number;

    @IsNumber({}, { message: "Total price must be a number" })
    @IsPositive({ message: "Total price must be a positive number" })
    @Type(() => Number)
    totalItems: number;

    @IsOptional()
    @IsEnum(OrderStatusList, {
        message: `Status must be one of the following: ${OrderStatusList.join(", ")}`
    })
    status?: OrderStatus = OrderStatus.PENDING;

    @IsOptional()
    @IsBoolean({ message: "Paid must be a boolean value" })
    paid?: boolean = false;
}

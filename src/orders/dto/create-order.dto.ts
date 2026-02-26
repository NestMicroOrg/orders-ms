import { ArrayMinSize, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { OrderItemDto } from "./order-item.dto";

export class CreateOrderDto {

    // @IsNumber({}, { message: "Total amount must be a number" })
    // @IsPositive({ message: "Total amount must be a positive number" })
    // @Type(() => Number)
    // totalAmount: number;

    // @IsNumber({}, { message: "Total price must be a number" })
    // @IsPositive({ message: "Total price must be a positive number" })
    // @Type(() => Number)
    // totalItems: number;

    // @IsOptional()
    // @IsEnum(OrderStatusList, {
    //     message: `Status must be one of the following: ${OrderStatusList.join(", ")}`
    // })
    // status?: OrderStatus = OrderStatus.PENDING;

    // @IsOptional()
    // @IsBoolean({ message: "Paid must be a boolean value" })
    // paid?: boolean = false;

    @IsArray({ message: "Items must be an array" })
    @ArrayMinSize(1, { message: "At least one item must be included in the order" })
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[]
}

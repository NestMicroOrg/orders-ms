import { IsNumber, IsPositive } from "class-validator";


export class OrderItemDto {

    @IsNumber({}, { message: "Product ID must be a number" })
    @IsPositive({ message: "Product ID must be a positive number" })
    productId: number;

    @IsNumber({}, { message: "Quantity must be a number" })
    @IsPositive({ message: "Quantity must be a positive number" })
    quantity: number;

    @IsNumber({}, { message: "Price must be a number" })
    @IsPositive({ message: "Price must be a positive number" })
    price: number;
}
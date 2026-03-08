import { IsString, IsUrl, IsUUID } from "class-validator";


export class PaidOrderDto {

    @IsString({ message: "Stripe payment ID must be a string" })
    stripePaymentId: string;

    @IsString({ message: "Order ID must be a string" })
    @IsUUID("4", { message: "Order ID must be a valid UUID" })
    orderId: string;

    @IsString({ message: "Receipt URL must be a string" })
    @IsUrl({}, { message: "Receipt URL must be a valid URL" })
    receiptUrl: string;
}
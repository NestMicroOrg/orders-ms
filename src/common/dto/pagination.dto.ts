import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @IsPositive({ message: 'The page must be a positive number' })
    @Type(() => Number)
    page?: number;

    @IsOptional()
    @IsPositive({ message: 'The limit must be a positive number' })
    @Type(() => Number)
    limit?: number;
}
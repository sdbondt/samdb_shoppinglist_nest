import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateItemDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsPositive()
    @IsNumber()
    quantity: number

}

export class UpdateItemDto {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    name?: string

    @IsPositive()
    @IsNumber()
    @IsOptional()
    quantity?: number

    @IsBoolean()
    @IsOptional()
    ordered?: boolean
}
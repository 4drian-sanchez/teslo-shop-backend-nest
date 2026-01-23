import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

    @ApiProperty({
        type: 'string',
        description: 'Titulo del producto'
    })
    @IsString()
    @MinLength(1)
    title: string

    @ApiProperty({
        type: 'number',
        description: 'precio del producto',
        nullable: true
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number

    @ApiProperty({
        type: 'string',
        description: 'descripción del producto',
        nullable: true
    })
    @IsString()
    @IsOptional()
    description?: string

    @ApiProperty({
        type: 'string',
        description: 'slug del producto',
        nullable: true
    })
    @IsString()
    @IsOptional()
    slug?: string

    @ApiProperty({
        type: 'string',
        description: 'stock del producto',
        nullable: true
    })
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number

    @ApiProperty({
        type: 'array',
        isArray: true,
        description: 'sizes del producto',
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[]

    @ApiProperty({
        type: 'array',
        isArray: true,
        description: 'tags del producto',
        nullable: true
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags?: string[]

    @ApiProperty({
        type: 'array',
        isArray: true,
        description: 'imagenes del producto',
        nullable: true
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[]

    @ApiProperty({
        type: 'string',
        description: 'gender del producto',
    })
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string
}

import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: 'd67828d8-55bb-42f5-af0c-36176a3471e3',
        description: 'Id del producto',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({
        example: 'Tommy Hill',
        description: 'nombre del producto',
        nullable: false
    })
    @Column('text', {
        unique: true
    })
    title: string

    @ApiProperty({
        example: '19.99',
        description: 'precio del producto',
        nullable: false,
        default: '0'
    })
    @Column('float', {
        default: 0
    })
    price: number

    @ApiProperty({
        example: 'descripción del producto',
        description: 'descripción del producto',
        nullable: true,
    })
    @Column('text', {
        nullable: true
    })
    description: string

    @ApiProperty({
        example: 'Tommy_Hill',
        description: 'slug del producto',
        nullable: false,
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    slug: string

    @ApiProperty({
        example: '20',
        description: 'stock del producto',
        default: '0'
    })
    @Column('int', {
        default: 0
    })
    stock: number

    @ApiProperty({
        example: '["SM", "M", "L"]',
        description: 'sizes del producto',
        isArray: true
    })
    @Column('text', {
        array: true
    })
    sizes: string[]

    @ApiProperty({
        example: '["shirt", "cheap"]',
        description: 'sizes del producto',
        isArray: true
    })
    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    @ApiProperty({
        example: 'men',
        description: 'gender del producto',
    })
    @Column('text')
    gender: string

    @ApiProperty({
        example: '["imagen.png", "imagen.jpg"]',
        description: 'sizes del producto',
        isArray: true
    })
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[]

    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true }
    )
    user: User


    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title
                .toLowerCase()
                .replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?/\s/]/g, '_');
        } else {
            this.slug = this.slug
                .toLowerCase()
                .replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?/\s/]/g, '_');
        }
    }

    @BeforeUpdate()
    checkSlugUpdated() {
        this.slug = this.slug
            .toLowerCase()
            .replace(/[~`!@#$%^&*()+={}\[\];:\'\"<>.,\/\\\?/\s/]/g, '_');
    }
}

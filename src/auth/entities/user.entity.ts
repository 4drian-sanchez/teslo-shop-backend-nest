import { Product } from 'src/products/entities';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text', {
        unique: true
    })
    email: string

    @Column('text', {
        select: false
    })
    password: string

    @Column('text')
    fullName: string

    @Column('bool', {
        default: false
    })
    isActive: boolean

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[]

    @OneToMany(
        () => Product,
        (product) => product.user 
    )
    product: Product

    @BeforeInsert()
    checkFieldsInsert() {
        this.email = this.email.toLowerCase().trim()
    }

    @BeforeUpdate()
    checkFieldsUpdated() {
        this.email = this.email.toLowerCase().trim()

    }

}

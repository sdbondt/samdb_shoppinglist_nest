import { Item } from 'src/items/item.entity'
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity('user')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    password: string

    @Column()
    username: string

    @Column({
        unique: true
    })
    email: string
    
    @OneToMany(
        () => Item,
        item => item.user
    )
    items: Item[]
}

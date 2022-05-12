import { User } from 'src/user/user.entity'
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('item')
export class Item extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    quantity: number

    @Column({
        default: false
    })
    ordered: boolean

    @ManyToOne(
        () => User,
        user => user.items
    )
    @JoinColumn({
        name: 'userId'
    })
    user: User

    @Column({
        name: 'userId'
    })
    userId: number
  
}
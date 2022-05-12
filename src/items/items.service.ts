import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from 'src/user/interceptors/user.interceptor';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreateItemDto, UpdateItemDto } from './dtos/dto';
import { Item } from './item.entity';

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }
    
    async findItem(itemId: number, user: UserInfo) {
        if (!user) {
            throw new UnauthorizedException('You must be logged in to do that.')
        } else {
            const item = await this.itemRepository.findOne({ where: { id: itemId, userId: user.userId }})
            if (!item) {
                throw new NotFoundException('No item found.')
            } else {
                return item
            }
        }  
    }

    async findItems(user: UserInfo) {
        if (!user) {
            throw new UnauthorizedException('You must be logged in to do that.')
        } else {
            const items = await this.itemRepository.find({ where: { userId: user.userId }})
            return items
        } 
    }

    async createItem({ quantity, name}: CreateItemDto, user: UserInfo) {
        if (!user) {
            throw new UnauthorizedException('You must be logged in to do that.')
        } else {
            const itemUser = await this.userRepository.findOne({ where: { id: user.userId }})
            const item = this.itemRepository.create({
                quantity,
                name,
                user: itemUser
            })
            await item.save()
            return item
        } 
    }

    async updateItem(itemId: number, user: UserInfo, quantity: number, name: string, ordered: boolean) {
        const item = await this.findItem(itemId, user)
        
        if (quantity) {
            item.quantity = quantity
        }

        if (name) {
            item.name = name
        }

        if (ordered) {
            item.ordered = ordered
        }

        await item.save()
        return item
    }

    async deleteItem(itemId: number, user: UserInfo) {
        const item = await this.findItem(itemId, user)
        await item.remove()
        return {
            message: 'Item got deleted.'
        }
    }
}

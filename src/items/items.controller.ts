import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { User } from 'src/user/decorators/user.decorator';
import { UserInfo } from 'src/user/interceptors/user.interceptor';
import { CreateItemDto, } from './dtos/dto';
import { ItemsService } from './items.service';


@Controller('items')
export class ItemsController {
    constructor(private readonly itemService: ItemsService) { }
    
    @Post('/')
    async postItem(
        @User() user: UserInfo,
        @Body() body: CreateItemDto
    ) {
        return this.itemService.createItem(body, user)
    }
    
    @Get('/')
    async getItems(
        @User() user: UserInfo
    ) {
        return this.itemService.findItems(user)
    }
    
    @Get('/:itemId')
    async getItem(
        @Param('itemId', ParseIntPipe) itemId: number,
        @User() user: UserInfo
    ) {
        return this.itemService.findItem(itemId, user)
    }
    
    @Patch('/:itemId')
    async updateItem(
        @Param('itemId', ParseIntPipe) itemId: number,
        @User() user: UserInfo,
        @Query('quantity') quantity?: number,
        @Query('ordererd') ordered?: boolean,
        @Query('name') name?: string
    ) {
        return this.itemService.updateItem(itemId, user, quantity, name, ordered)
    }
    
    @Delete('/:itemId')
    async deleteItem(
        @Param('itemId', ParseIntPipe) itemId: number,
        @User() user: UserInfo
    ) {
        return this.itemService.deleteItem(itemId, user)
    }
}

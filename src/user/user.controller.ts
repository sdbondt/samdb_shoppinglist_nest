import { Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dtos/dto';
import { UserInfo } from './interceptors/user.interceptor';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService
    ) { }
    
    @Get('/')
    async getUsers() {
        return this.userService.findUsers()
    }

    @Get('/:userId')
    async getUser(
        @Param('userId', ParseIntPipe) userId: number
    ) {
        return this.userService.findUser(userId)
    }

    @Delete('/:userId')
    async deleteUser(
        @Param('userId', ParseIntPipe) userId: number,
        @User() user: UserInfo
    ) {
       return this.userService.deleteUser(userId, user)
    }

    @Patch('/:userId')
    async updateUser(
        @Param('userId', ParseIntPipe) userId: number,
        @User() user: UserInfo,
        @Body() body: UpdateUserDto
    ) {
        return this.userService.updateUser(userId, user, body)
    }
        
    @Get('/me')
    getMyProfile(@User() user: UserInfo) {
        if (!user) {
            throw new HttpException('You must be logged in.', 400)
        } else {
            return user
        }
    }
}

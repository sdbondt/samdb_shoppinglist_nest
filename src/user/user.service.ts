import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/dto';
import { UserInfo } from './interceptors/user.interceptor';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }
    
    async findUsers(): Promise<User[]> {
        const users = await this.userRepository.find()
        return users
    }

    async findUser(userId: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: userId } })
        if (!user) {
            throw new NotFoundException('No such user found')
        } else {
            return user
        }
    }

    async updateUser(userId: number, user: UserInfo, { email, password, username }: UpdateUserDto) {
        if (!user) {
            throw new UnauthorizedException('You must be logged in to do this.')
        }
        if (user.userId !== userId) {
            throw new UnauthorizedException('Not authorized to do this.')
        }
        const updateUser = await this.userRepository.findOne({ where: { id: userId } })
        if (!updateUser) {
            throw new NotFoundException('No such user found')
        } else {
            if (email) {
                const emailExist = await this.userRepository.findOne({ where: { email } })
                if (emailExist) {
                    throw new ConflictException('User already exists')
                } else {
                    updateUser.email = email
                }
            }

            if (username) {
                updateUser.username = username
            }

            if (password) {
                const hashedPW = await this.hashPW(password)
                updateUser.password = hashedPW
            }

            await updateUser.save()
            return updateUser
        }
    }

    async deleteUser(userId: number, user: UserInfo) {
        if (user.userId != userId) {
            throw new UnauthorizedException('Not authorized to do this.')
        }
        const deleteUser = await this.userRepository.findOne({ where: { id: userId } })
        if (!deleteUser) {
            throw new NotFoundException('No such user found')
        } else {
            await deleteUser.remove()
            return {
                message: 'User deleted'
            }
        }
    }

    private async hashPW(password: string) {
        const hashedPW = await bcrypt.hash(password, 10)
        return hashedPW
    }

}

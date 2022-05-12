import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import { InjectRepository } from '@nestjs/typeorm';
config()

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>) { }
    
    async signup(
        email: string, username: string, password: string
    ) {
        const userExists = await this.userRepository.findOne({
            where: { email }
        })
        
        if (userExists) {
            throw new ConflictException('User already exists')
        } else {
            const hashedPW = await this.hashPW(password)
            const user = this.userRepository.create({
            username,
            email,
            password: hashedPW
            })
            await user.save()
            const token = await this.generateJWT(user)
            return { user, token }
        }        
    }

    async login(
        email: string, password: string
    ) {
        const user = await this.userRepository.findOne({
            where: { email }
        })
        if (!user) {
            throw new HttpException('Invalid credentials.',400)
        } else {
            const isValid = await this.comparePW(password, user)
            if (!isValid) {
                throw new HttpException('Invalid credentials.', 400)
            } else {
                const token = await this.generateJWT(user)
                return {
                    token,
                    user,
                }
            }
        }        

    }

    private async hashPW(password: string) {
        const hashedPW = await bcrypt.hash(password, 10)
        return hashedPW
    }

    private async generateJWT(user: User) {
        return jwt.sign({
            userId: user.id,
            username: user.username,
            email: user.email
        },
            process.env.JWT_SECRET as string,
            {
            expiresIn: "30d"
            })
    }

    private async comparePW(password: string, user: User) {
        return bcrypt.compare(password, user.password)
    }
}

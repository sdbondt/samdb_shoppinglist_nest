import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { LoginDto, SignupDto } from '../types/dtos/dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService){}
    @Post('/signup')
    async signup(
        @Body() {password, confirmPassword, username, email }: SignupDto
    ) {
        if (password !== confirmPassword) {
            throw new UnauthorizedException('Passwords don\'t match.')
        } else {
            return this.authService.signup(email, username, password)
        }
    }

    @Post('/login')
    async login(
        @Body() { email, password }: LoginDto
    ) {
        return this.authService.login(email, password)
    }
}

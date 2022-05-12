import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class SignupDto {   
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    username: string

    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message: 'Password must be 8 characters long and contain a number, a uppercase and a lowercase letter.'
    })
    password: string

    @IsNotEmpty()
    confirmPassword: string
}

export class LoginDto {
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string
}
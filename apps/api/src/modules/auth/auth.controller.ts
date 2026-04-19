import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { IsEmail, IsString, MinLength } from 'class-validator'
import { AuthService } from './auth.service'

class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password)
    return this.authService.login(user)
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('token') token: string) {
    // Token refresh logic
    return { message: 'Token refreshed' }
  }
}

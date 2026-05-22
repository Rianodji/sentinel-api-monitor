import { Controller, Post, Body, HttpCode, HttpStatus, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import { LoginUserDto } from '../../application/dtos/login-user.dto';
import { SendTestEmailCommand } from '../../../notification/application/commands/send-test-email.command';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  async register(@Body() dto: RegisterUserDto) {
    await this.registerUserUseCase.execute(dto);
    return { message: 'User successfully registered' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in, returns JWT' })
  async login(@Body() dto: LoginUserDto) {
    return this.loginUserUseCase.execute(dto);
  }

  @Get('test-email')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async testEmail(@Query('email') email: string) {
    await this.commandBus.execute(new SendTestEmailCommand(email));
    return { message: 'Email de test envoyé via CommandBus' };
  }
}

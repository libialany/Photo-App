import {
  Controller,
  Get,
  Res,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  AbilityFactory,
  Action,
} from 'src/ability/ability.factory/ability.factory';
import { Request } from 'express';
import { UsersService } from './user.service';
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private abilityFactory: AbilityFactory,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  // GET users
  //@UseGuards(JwtAuthGuard)
  @Get('rol')
  async findRol(@Req() req: Request) {
    // if (!req.user || !req.user['rol'] || req.user['rol'] === '') {
    //   throw new BadRequestException('No tienes permisos');
    // }
    // return await {
    //   rol: req.user['rol'],
    // };
    return 123;
  }
  // GET users
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }
  //Profile
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  findById(@Req() req: Request) {
    if (!req.user || !req.user['sub']) {
      throw new BadRequestException('Not authorized');
    }
    const user = this.usersService.findByUsername(req.user['username']);
    return user;
  }
  // update
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

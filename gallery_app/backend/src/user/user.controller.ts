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
import { HasRoles } from 'src/auth/decorators/has-roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles-auht.guard';
import { Role } from 'src/auth/model/roles.enum';
import { Request, Response } from 'express';
import { UsersService } from './user.service';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  // GET users
  @UseGuards(JwtAuthGuard)
  @Get('rol')
  async findRol(@Req() req: Request) {
    if (!req.user || !req.user['roles'] || req.user['roles'] === '') {
      throw new BadRequestException('No tienes permisos');
    }
    return await {
      rol: req.user['roles'],
    };
  }
  // GET users
  // @HasRoles(Role.Admin)
  // @UseGuards(JwtAuthGuard, RolesGuard)

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: Request) {
    //console.log(req?.user);
    // const user = req.user;
    // const newUser = new User();
    // newUser.roles = user['roles'];
    // newUser.username = user['username'];
    // const ability = this.abilityFactory.createForUser(newUser);
    // const isAllow = ability.can(Action.Read, newUser);
    // if (!isAllow) {
    //   throw new BadRequestException('No tienes permisos');
    // }
    return await this.usersService.findAll();
  }
  @HasRoles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('profile')
  findById(@Req() req: Request) {
    if (!req.user || !req.user['sub']) {
      throw new BadRequestException('No tienes permisos');
    }
    const user = this.usersService.findById(req.user['sub']);
    return user;
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
User;
import { EntityManager, Repository } from 'typeorm';
@Injectable()
export class UsersService {
  constructor(
    @InjectEntityManager() private noticiaManager: EntityManager,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = this.userRepository.save(createUserDto);
    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  async findByRefreshToken(rf: string): Promise<User> {
    return this.userRepository.findOneBy({ refreshToken: rf });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const foundUser = await this.userRepository.findOneBy({ id: id });
    if (!foundUser) throw new Error('User not found');
    const newUser = new User();
    newUser.username = foundUser.username;
    newUser.password = foundUser.password;
    newUser.rol = foundUser.rol;
    newUser.refreshToken = updateUserDto.refreshToken;
    return this.userRepository.update(id, newUser);
  }
  async updateToken(id: string, refreshToken: string) {
    const foundUser = await this.userRepository.findOneBy({ id: id });
    if (!foundUser) throw new Error('User not found');
    const newUser = new User();
    newUser.refreshToken = refreshToken;
    return this.userRepository.update(id, newUser);
  }

  

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}

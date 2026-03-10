import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import argon from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async create(
    email: string,
    password: string,
    { isAdmin }: { isAdmin: boolean } = { isAdmin: false },
  ): Promise<User> {
    const hashedPassword = await argon.hash(password);
    const user = this.usersRepository.create({
      email,
      password: hashedPassword,
      isAdmin,
    });
    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id });
  }
}

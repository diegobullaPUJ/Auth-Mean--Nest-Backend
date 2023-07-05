import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs'

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel( User.name ) 
    private userModel: Model<User>,
    private jwtService: JwtService
    ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // 1. Encriptar contraseña.
      
      const { password, ...userData } = createUserDto;

      const newUser = new this.userModel({
        password: bcryptjs.hashSync( password, 10 ),
        ...userData
      });
      await newUser.save();
      const {password:_, ...user} = newUser.toJSON();

      return user;

    } catch(error){
      if( error.code === 11000 ) {
        throw new BadRequestException(`${ createUserDto.email } already exist!`);
      }
      throw new InternalServerErrorException('Something terrible happen!!!');
    }
  }


  async register( registerUserDto: RegisterUserDto ): Promise<LoginResponse> {
    
    const registerUser = await this.create( registerUserDto );

    return {
      user: registerUser,
      token: this.getJwtToken( {id: registerUser._id} ),
    }

  }

  async login ( loginDto: LoginDto ): Promise<LoginResponse> {
    
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email: email });

    if( !user ) {
      throw new UnauthorizedException('Not valid credentials - email');
    }
    
    if( !bcryptjs.compareSync( password, user.password ) ) {
      throw new UnauthorizedException( 'Not valid credentials - password');
    }

    const{ password:_, ...rest } = user.toJSON();

    return {
      user: rest,
      token: this.getJwtToken( {id: user.id} ),
    }
  }

  getJwtToken ( payload: JwtPayload ) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById( userId: string  ) {
    const user = await this.userModel.findById( userId );
    const { password, ...rest } = user.toJSON();
    return rest;
  }
  
  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}

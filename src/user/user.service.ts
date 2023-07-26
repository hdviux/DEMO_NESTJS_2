import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}
  async getByID(accountID: string): Promise<any> {
    const fn = await this.userModel
      .findOne({
        accountID: new mongoose.Types.ObjectId(accountID),
      })
      .populate('accountID');
    return {
      result: fn,
    };
  }

  async updateName(userID: string, data: UpdateUserDto): Promise<any> {
    const fn = await this.userModel
      .findByIdAndUpdate(userID, { fullName: data.fullName }, { new: true })
      .populate('accountID');
    return {
      result: fn,
    };
  }
}

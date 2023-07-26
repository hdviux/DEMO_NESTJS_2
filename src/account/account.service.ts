import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name)
    private accountModel: mongoose.Model<Account>,
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}
  async create(data: CreateAccountDto): Promise<any> {
    const rs = await this.accountModel.create(data);
    const fn = await this.userModel.create({ accountID: rs._id });
    return {
      result: fn,
    };
  }

  async login(data: CreateAccountDto): Promise<any> {
    const find = await this.accountModel.findOne({ userName: data.userName });
    if (find) {
      const validPassword = bcrypt.compareSync(data.password, find.password);
      if (validPassword) {
        const fn = await this.userModel.aggregate([
          {
            $lookup: {
              from: 'accounts',
              localField: 'accountID',
              foreignField: '_id',
              as: 'account',
            },
          },
          { $match: { 'account.userName': data.userName } },
        ]);
        const token = jwt.sign(
          { userID: fn[0]._id.toString() },
          process.env.TOKEN_SECRET as string,
          { expiresIn: '24h' },
        );
        return {
          result: fn[0],
          token: token,
        };
      } else
        return {
          result: '!password',
        };
    } else
      return {
        result: '!userName',
      };
  }

  async changePassword(userID: string, data: UpdateAccountDto) {
    const find = (await this.userModel
      .findById(userID)
      .populate('accountID')) as any;
    const validPassword = bcrypt.compareSync(
      data.password,
      find.accountID.password,
    );
    if (validPassword) {
      const fn = await this.accountModel.findByIdAndUpdate(
        find.accountID._id.toString(),
        {
          password: bcrypt.hashSync(data.newPassword, 10),
        },
        { new: true },
      );
      return {
        result: fn,
      };
    } else {
      return {
        result: '!Password',
      };
    }
  }
}

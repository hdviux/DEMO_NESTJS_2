import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true, unique: true })
  userName: string;
  @Prop({ required: true })
  password: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

AccountSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

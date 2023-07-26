import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as uuid from 'uuid';

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  })
  accountID: mongoose.Schema.Types.ObjectId;
  @Prop({ required: true, default: uuid.v4() })
  fullName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

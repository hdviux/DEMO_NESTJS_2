import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from './entities/account.entity';
import { UserSchema } from 'src/user/entities/user.entity';
import { TokenMiddleware } from 'src/middleware/verifyToken';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Account', schema: AccountSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenMiddleware).forRoutes({
      path: 'account/password',
      method: RequestMethod.PUT,
    });
  }
}

import { Controller, Post, Body, Put, Request } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
// import { Account } from './entities/account.entity';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Post('create')
  create(@Body() data: CreateAccountDto): Promise<any> {
    return this.accountService.create(data);
  }
  @Post('login')
  login(@Body() data: CreateAccountDto): Promise<any> {
    return this.accountService.login(data);
  }
  @Put('password')
  changePassword(@Request() req, @Body() data: UpdateAccountDto): Promise<any> {
    console.log(req.userID);
    return this.accountService.changePassword(req.userID, data);
  }
}

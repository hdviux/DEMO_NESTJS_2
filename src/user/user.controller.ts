import { Body, Controller, Get, Param, Put, Request } from '@nestjs/common';

import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/get/:accountID')
  getByID(@Param('accountID') accountID: string): Promise<any> {
    return this.userService.getByID(accountID);
  }

  @Put('/updatename')
  update(@Request() req, @Body() data: UpdateUserDto) {
    console.log(req.userID);

    return this.userService.updateName(req.userID, data);
  }
}

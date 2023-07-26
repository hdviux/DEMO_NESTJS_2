// import { HttpException } from '@nestjs/common/exceptions/http.exception';
// import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import * as jwt from 'jsonwebtoken';
// import { AuthorService } from './author.service';
// import { Author } from './schemas/author.schema';
// export interface IGetUserAuthInfoRequest extends Request {
//   author: Author;
//   _id: string;
// }
// @Injectable()
// export class AuthorMiddleware implements NestMiddleware {
//   constructor(private readonly authorService: AuthorService) {}
//   async use(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
//     const authHeaders = req.headers.authorization;

//     if (authHeaders && (authHeaders as string).split(' ')[1]) {
//       const token = (authHeaders as string).split(' ')[1];
//       const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET);
//       const user = await this.authorService.findById(decoded._id);
//       if (!user) {
//         throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
//       }
//       req.author = user;
//       req._id = decoded.id;
//       next();
//     } else {
//       throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
//     }
//   }
// }
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export interface IExpand extends Request {
  userID: string;
}
@Injectable()
export class TokenMiddleware implements NestMiddleware {
  async use(req: IExpand, res: Response, next: NextFunction) {
    const authHeader = req.header('Authorization');
    console.log(authHeader);
    if (authHeader === undefined) {
      throw new HttpException('!Token', HttpStatus.UNAUTHORIZED);
    } else {
      try {
        const decoded: any = jwt.verify(authHeader, process.env.TOKEN_SECRET);
        req.userID = decoded.userID;
        next();
      } catch (error) {
        console.log(4);
        throw new HttpException('Token invalid', HttpStatus.UNAUTHORIZED);
      }
    }
  }
}

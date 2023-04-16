import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Cookies } from './custom-decorators/cookies';
import { Request, Response } from 'express';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  myEndpoint(@Res() res: Response) {
    res.cookie('myCookieName', 'myCookieValue');
    res.send('Cookie set!');
  }
  // getHello(@Cookies('access_token') refreshtoken: string) {
  //   console.log(refreshtoken);
  //   return '';
  // }
}

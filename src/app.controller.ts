import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import {Response} from 'express';
import { AuthGuard } from './auth.guard';
import { TokenService } from './token.service';
import { Authorization } from './authorization.decorator';
import { authModel } from './auth.model';
@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService,private readonly tokenservice:TokenService) {}


    @Post('login')
    async login(@Body() Body,@Res() res){
        console.log(Body);
        const result=await this.appService.loginService(Body.email,Body.password);
        if(!result.id.length) return res.status(HttpStatus.SERVICE_UNAVAILABLE).send("server error");
        return res.set("unique_id",result.id).status(HttpStatus.OK).send({access_token:result.access_token});
    }

    @UseGuards(AuthGuard)
    @Get('info')
    async info(@Res() res:Response,@Authorization() user:authModel){

        console.log(user);
        const token=await this.tokenservice.SetToken(user.uid,user.user_guid);
        if(!token.length) return res.status(HttpStatus.SERVICE_UNAVAILABLE).send("server error");
        
        return res.set("unique_id",token).status(HttpStatus.OK).send("data for you")
    }


    @Post('logout')
    async logout(@Body() body,@Res() res:Response){
        const result=await this.appService.LogoutService(body);
        return res.status(HttpStatus.OK).json({success:result});
    }
} 

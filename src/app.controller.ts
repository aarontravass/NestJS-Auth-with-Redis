import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import {Response} from 'express';
import { AuthGuard } from './auth.guard';
import { TokenService } from './token.service';
import { Authorization } from './authorization.decorator';
@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService,private readonly tokenservice:TokenService) {}


    @Post('login')
    async login(@Body() Body,@Res() res){
        console.log(Body);
        const result=await this.appService.loginService(Body.email,Body.password);
        
        return res.set("unique_id",result.id).status(HttpStatus.OK).send({access_token:result.access_token});
    }

    @UseGuards(AuthGuard)
    @Get('info')
    async info(@Res() res:Response,@Authorization() user:string){

        console.log(user);
        const token=await this.tokenservice.SetToken(user);
        if(!token.length) res.status(HttpStatus.SERVICE_UNAVAILABLE).send("server error");
        
        return res.set("unique_id",token).status(HttpStatus.OK).send("data for you")
    }
} 

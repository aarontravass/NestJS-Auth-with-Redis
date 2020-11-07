import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';
import * as Crypto from 'crypto';
import * as redis from 'redis';
import {promisify} from 'util';
import { TokenService } from './token.service';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }
    constructor(private readonly tokenservice:TokenService){}

   

    
    


    async loginService(email:string,passowrd:string):Promise<any>{
        const user_id="94ba3699-6f87-48d0-b24b-b063bdbee716";
        const accessToken=await this.generateAccessToken(user_id,email);
        const unique_id = await this.tokenservice.SetToken(user_id);
        
        return {access_token:accessToken,id:unique_id};
    }


    private async generateAccessToken(user_id:string,email:string):Promise<any> {
        const expiresIn = 3600;
        const payload={user_guid:"",e_email:""};
        payload.user_guid = user_id;
        payload.e_email = email;
        
        return {accessToken:await jwt.sign(JSON.parse(JSON.stringify(payload)), "strongkey", { expiresIn: expiresIn })};
    }
v
}



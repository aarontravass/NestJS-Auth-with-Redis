import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';
import * as Crypto from 'crypto';
import * as redis from 'redis';
import {promisify} from 'util';
import { TokenService } from './token.service';

@Injectable()
export class AppService {
   
    constructor(private readonly tokenservice:TokenService){}

   

    
    


    async loginService(email:string,passowrd:string):Promise<any>{
        const user_guid="94ba3699-6f87-48d0-b24b-b063bdbee716";
        const accessToken=await this.generateAccessToken(user_guid,email);
        const unique_id = await this.tokenservice.SetToken(accessToken.uid,user_guid);
        
        return {access_token:accessToken.accessToken,id:unique_id};
    }


    private async generateAccessToken(user_id:string,email:string):Promise<any> {
        const expiresIn = 3600;
        const token=Crypto.randomBytes(100).toString('hex');
        const payload={user_guid:"",e_email:"",uid:""};
        payload.user_guid = user_id;
        payload.e_email = email;
        payload.uid=token;
        return {accessToken:await jwt.sign(JSON.parse(JSON.stringify(payload)), "strongkey", { expiresIn: expiresIn }),uid:token};
    }


    async LogoutService(body:any):Promise<boolean>{
        console.log(body);
        const payload:any=await jwt.verify(body.accessToken,"strongkey");
        const result=await this.tokenservice.deleteToken(payload.uid);
        return result;
    }

}



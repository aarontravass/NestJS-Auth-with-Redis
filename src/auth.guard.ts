import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';
import * as Crypto from 'crypto';
import * as redis from 'redis';
import {promisify} from 'util';
import { TokenService } from './token.service';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    constructor(private readonly tokenservice:TokenService){}


    private async validateRequest(request:Request):Promise<boolean>{
        console.log(request.headers);
        const auth=request.headers['authorization'];
        const unique_id=request.headers['unique_id'];
        const bearer_token=auth.split(' ')[1];
        const payload:any=await jwt.verify(bearer_token.toString(),"strongkey");
        const user_guid=(payload.user_guid);
        const result=await this.tokenservice.GetToken(user_guid,unique_id);
        console.log(result);
        return result;
    }
}

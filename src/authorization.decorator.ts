import { SetMetadata, UnauthorizedException } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { authModel } from './auth.model';



export const Authorization = createParamDecorator(
    async (data: string, ctx: ExecutionContext) => {
      const request:Request = ctx.switchToHttp().getRequest();
      try {
        const {authorization:access_token}=request.headers;
        const payload:any=await jwt.verify(access_token.split(' ')[1],"strongkey");
        const auth=new authModel();
        auth.user_guid=payload.user_guid;
        auth.uid=payload.uid;
        return auth;
      } catch (error) {
          throw new UnauthorizedException();
      }

  
     
    },
  );
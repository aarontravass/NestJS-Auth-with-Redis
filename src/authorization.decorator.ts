import { SetMetadata, UnauthorizedException } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';



export const Authorization = createParamDecorator(
    async (data: string, ctx: ExecutionContext) => {
      const request:Request = ctx.switchToHttp().getRequest();
      try {
        const {authorization:access_token}=request.headers;
        const payload:any=await jwt.verify(access_token.split(' ')[1],"strongkey");
        return payload.user_guid;
      } catch (error) {
          throw new UnauthorizedException();
      }

  
     
    },
  );
import { Injectable } from '@nestjs/common';
import * as redis from 'redis';
import {promisify} from 'util';
import * as Crypto from 'crypto';

@Injectable()
export class TokenService {
    constructor(){
        
        this.client.on('error',(error)=>{
            console.log(error);
            
        })

        this.client.on('connect',()=>{
            console.log("redis connected");
        })
    }


    private readonly client=redis.createClient(6379,"",{no_ready_check:true});;

    private getmethod=promisify(this.client.hmget).bind(this.client);
    private setmethod=promisify(this.client.hmset).bind(this.client);


    async SetToken(user_guid:string):Promise<string>{
        const unique_id = Crypto.randomBytes(16).toString("hex");
        let success=true;
        await this.setmethod(user_guid,"unique_id",unique_id).then(result=>{
            console.log(result);
            success=true;
        }).catch(error=>{
            console.log(error);
            success=false;
        })
        return success?unique_id:"";
    }

    async GetToken(user_guid:string,unique_id:string):Promise<boolean>{
        let success=true;
        await this.getmethod(user_guid,"unique_id").then(result=>{
            console.log(typeof(result[0]));
            console.log(typeof(unique_id));
            if(unique_id===result[0]){
                success=true;
            }
            else{
                success=false;
                return;
            }
        }).catch(error=>{
            console.log(error);
            success=false;
        })

        return success;
    }
}

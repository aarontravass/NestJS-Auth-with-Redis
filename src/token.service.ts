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
    private deletemethod=promisify(this.client.del).bind(this.client);

    async SetToken(uid:string,user_guid:string):Promise<string>{
        const unique_id = Crypto.randomBytes(16).toString("hex");
        let success=true;
        await this.setmethod(uid,"unique_id",unique_id,"user_guid",user_guid).then(result=>{
            console.log(result);
            success=true;
        }).catch(error=>{
            console.log(error);
            success=false;
        })
        return success?unique_id:"";
    }

    async GetToken(user_guid:string,unique_id:string,uid:string):Promise<boolean>{
        let success=true;
        await this.getmethod(uid,"unique_id").then(result=>{
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
        if(!success) return false;
        await this.getmethod(uid,"user_guid").then(result=>{
            console.log(result[0]);
            console.log(user_guid);
            if(user_guid===result[0]){
                success=true;
            }
            else{
                success=false;
                return;
            }
        }).catch(error=>{
            success=false;
            console.log(error);
        })

        return success;
    }


    async deleteToken(uid:string):Promise<boolean>{

        let success=true;
        await this.deletemethod(uid).then(result=>{
            console.log(result);
            success=true;
            
        }).catch(error=>{
            console.log(error);
            success=false;
        })
       

        return success;
    }
}

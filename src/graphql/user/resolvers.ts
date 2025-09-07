import { get } from "http";
import { CreateUserPayload, UserService } from "../../services/user.js";
import { User } from "./index.js";

const queries={
    getUserToken:async(_:any,payload:{email:string,password:string}):Promise<string>=>{
        const res=await UserService.getUserToken(payload);
        return res;
    }
,
    getCurrentLoggedInUser:async(_:any,parameters:any,context:any)=>{
        console.log("context in getCurrentLoggedInUser",context);
        if(context && context.user){
            const id=(context.user as any).id;
            const user=await UserService.getUserById(id);
            return user;
        }
}
}
const mutations={
    createUser:async(_:any,payload:CreateUserPayload)=>{
        const res = await UserService.createUser(payload);
        return res.id;
    }
}

export const resolvers={queries,mutations};
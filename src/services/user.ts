import { PrismaClient } from "@prisma/client";
import {createHmac,randomBytes} from 'node:crypto';
import jwt from 'jsonwebtoken';
export interface CreateUserPayload{
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
}

export interface GetUserTokenPayload{
    email:string;
    password:string;
}

const JWT_SECRET="abc";

export class UserService {
  public static createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = randomBytes(32).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    const prisma = new PrismaClient();

    return prisma.user.create({
      data: {
        firstName,
        lastName: lastName ?? null, // ✅ convert undefined → null
        email,
        salt,
        password: hashedPassword,
      },
    });
  }

  private static getUserByEmail(email: string) {
    const prisma = new PrismaClient();
    return prisma.user.findUnique({ where: { email } });
  }

  public static getUserById(id: string) {
    const prisma = new PrismaClient();
    return prisma.user.findUnique({ where: { id } });
  }
  
  public static async getUserToken(payload: GetUserTokenPayload) {
    const {email,password}=payload;
    const user=await UserService.getUserByEmail(email);
    if(!user){
        throw new Error("Invalid email or password");
    }
    const userSalt=user.salt;
    const userHashedPassword=createHmac("sha256",userSalt).update(password).digest("hex");
    if(userHashedPassword!==user.password){
        throw new Error("Invalid password");
    }
    //generate token
const token=jwt.sign({id:user.id,email:user.email},JWT_SECRET);
return token;
  }

  public static decodeToken(token:string){
    return jwt.verify(token,JWT_SECRET);
  }
}

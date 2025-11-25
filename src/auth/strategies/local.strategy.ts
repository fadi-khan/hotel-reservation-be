import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Strategy } from "passport-local";
import { UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';


export class LocalStrategy extends PassportStrategy(Strategy){
    constructor (private authService:AuthService){
        super({usernameField:'email',passwordField:'password'});
    }
    
   async validate(email: string , password:string): Promise<any> {
      const user =  await this.authService.validateUser(email,password);
      console.log(" called by local stratgey ")
      if(!user) throw new UnauthorizedException(" Invalid credentials ")

        const pwMatches = bcrypt.compare(password, user.password)
        if(!pwMatches) throw new UnauthorizedException(" Wrong email or password ")

        return user;    


    }
    
}
import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/database/entities/user.entity";
import { Repository } from "typeorm";

export class JwtStrategy extends PassportStrategy(Strategy,"jwt"){
    constructor(
        configService:ConfigService,
        @InjectRepository(User)
        private  userRepo :Repository<User>
    ){
       super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
    }


   async validate(payload:any,req:Request){
        console.log("request coming from : ",req.url)
        console.log("requests base url : ",req.baseUrl )
        const user = await this.userRepo.findOne({where:{id:payload.sub}})
        console.log("called by JWT strategy ")
        if(!user) throw new UnauthorizedException("Invalid Credential")

        return({id:user.id , email:user.email})


    }
    
}
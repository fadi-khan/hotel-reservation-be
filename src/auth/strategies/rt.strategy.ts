import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/database/entities/user.entity";
import { Repository } from "typeorm";

export class RTStrategry extends PassportStrategy(Strategy , 'jwt-refresh') {


    constructor (
        config:ConfigService,
        @InjectRepository(User) private userRepo : Repository<User>
    ){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey:config.getOrThrow("JWT_REFRESH_SECRET"),
            passReqToCallback:true
        });
    }
    validate(req:Request, payload:any) {
        const auth = req.get('authorization') ?? "";

        const token = auth.replace('Bearer', "").trim();

        console.log("calling from Refresh Token Strategy")
        if(!token) throw new UnauthorizedException("Refresh token is missing ")


       return({ ...payload , refreshToken : token})     
    }


}
import { UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/database/entities/user.entity";
import { Repository } from "typeorm";

export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    configService: ConfigService,
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token = req?.cookies?.['access_token'];

          return token;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken() // in case the cookies method fails 
      ]),
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      passReqToCallback: true
    });
  }


  async validate(req: Request, payload: any) {
    console.log("request coming from : ", req.url)
    console.log("requests base url : ", req.baseUrl)

    const user = await this.userRepo.findOne({ where: { id: payload.sub } })


    console.log("called by JWT strategy ")
    if (!user) throw new UnauthorizedException("Invalid Credential")

    return ({
      sub: user.id,
      email: user.email,
      name: user.name,
      role:user.userType
    })


  }

}
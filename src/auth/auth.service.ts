import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dto/signUp.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signIn.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.userRepo.findOne({
            where: { email },
        });

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return null;

        return user;
    }


    async signUp(signupDto: SignUpDto) {

        const existing = await this.userRepo.findOne({ where: { email: signupDto.email } });

        if (existing) {
            throw new BadRequestException("User already exists");
        }
        const bycryptPassword = await bcrypt.hash(signupDto.password, 10);

        const user = this.userRepo.create({
            name: signupDto.name,
            email: signupDto.email,
            password: bycryptPassword,
            userType: signupDto.userType
        })

        await this.userRepo.save(user);

        const tokens = await this.getTokens(user.id, user.email)
        await this.updateRTHash(user.id, tokens.refresh_token)

        return tokens;

    }


    async signIn(signIn: SignInDto) {

        const user = await this.userRepo.findOne({ where: { email: signIn.email } })

        if (!user) {
            throw new ForbiddenException(" User not found")
        }

        const pwMatches = await bcrypt.compare(signIn.password, user.password)

        if (!pwMatches) {

            throw new ForbiddenException("Email or Password is wrong")

        }

        const tokens = await this.getTokens(user.id, user.email)

        await this.updateRTHash(user.id, tokens.refresh_token)

        return tokens;
    }


    async getTokens(id: number, email: string) {

        // to get the token first we create the payload 
        const payload = {
            sub: id,
            email
        }

        // then we pass the payload to the jwt service to generate the token
        const access_token = await this.jwtService.signAsync(payload, {
            expiresIn: this.configService.get("JWT_EXPIRES_IN"),
            secret: this.configService.get("JWT_SECRET")
        })

        const refresh_token = await this.jwtService.signAsync(payload, {
            expiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN"),
            secret: this.configService.get("JWT_REFRESH_SECRET")
        })

        return { access_token, refresh_token }
    }

    async updateRTHash(id: number, rt: string) {

        const bycryptRefreshToken = await bcrypt.hash(rt, 10);

        await this.userRepo.update(id, { refreshToken: bycryptRefreshToken });

    }

    async refreshTokens(userId: number, refreshToken: string) {

        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user || !user.refreshToken) {
            throw new ForbiddenException("Access Denied");
        }
        const rtMatch = await bcrypt.compare(refreshToken, user.refreshToken);
        if (!rtMatch) {
            throw new ForbiddenException("Access Denied");
        }

        const tokens = await this.getTokens(userId, user.email)

        await this.updateRTHash(userId, tokens.refresh_token)

        return tokens;


    }

    async logout(userId: number) {
        await this.userRepo.update({ id: userId }, { refreshToken: null })

    }


}

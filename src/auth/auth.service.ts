import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from './dto/signUp.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signIn.dto';
import { Otp } from 'src/database/entities/otp.entity';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Otp)
        private readonly otpRep: Repository<Otp>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly mailer : MailerService
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


    // async signIn(signIn: SignInDto) {

    //     const user = await this.userRepo.findOne({ where: { email: signIn.email } })

    //     if (!user) {
    //         throw new ForbiddenException(" User not found")
    //     }

    //     const pwMatches = await bcrypt.compare(signIn.password, user.password)

    //     if (!pwMatches) {

    //         throw new ForbiddenException("Email or Password is wrong")

    //     }

    //     const tokens = await this.getTokens(user.id, user.email)

    //     await this.updateRTHash(user.id, tokens.refresh_token)

    //     return tokens;
    // }

    async signIn(signInDto: SignInDto) {
        const user = await this.userRepo.findOne({ where: { email: signInDto.email } });

        if (!user) throw new ForbiddenException("User not found");

        const pwMatches = await bcrypt.compare(signInDto.password, user.password);
        if (!pwMatches) throw new ForbiddenException("Email or Password is wrong");

        const { code } = await this.generateOtp(user.id);


        return {
            message: "OTP sent to email",
            mfaRequired: true,
            email: user.email,
            otp:code
        };
    }
    async verifyOtpAndLogin(email: string, otp: number) {
        const isValid = await this.validateOtp(email, otp);

        if (!isValid) {
            throw new UnauthorizedException("Invalid or expired OTP");
        }

        const user = await this.userRepo.findOne({ where: { email:email } });


        if (!user) {
            throw new NotFoundException("user not found")
        }

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRTHash(user.id, tokens.refresh_token);

        return tokens; // Full Access
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

    async generateOtp(userId: number) {

        const validatedUser = await this.userRepo.findOne({ where: { id: userId } })

        if (!validatedUser) throw new UnauthorizedException("Unauthorized access . Failded to generate the OTP!")
        const otpCode = Math.floor(100000 + Math.random() * 900000)



        await this.otpRep.delete({ user: { id: validatedUser.id } })
        const bycryptOtp = await bcrypt.hash(otpCode.toString(), 10);

        const otpExpiry = new Date()

        otpExpiry.setMinutes(otpExpiry.getMinutes() + 5)

        const otpEntry = await this.otpRep.create({ otp: bycryptOtp, expiresAt:otpExpiry, user: validatedUser })

        await this.otpRep.save(otpEntry)
        // disabled the otp sending to email for testing 
        // await this.mailer.sendOtp(validatedUser.email,otpCode.toString()) 


        return { message: "OTP sent successfully", code: otpCode }; // Code returned for testing


    }

    async  validateOtp(email: string, otp: number) {

        const otpRecord = await this.otpRep.findOne(
            {
                where: { user: { email: email } },
                relations: ['user'],
                order: {createdAt:'DESC'}
            },
        )

        if (!otpRecord) throw new NotFoundException("OTP not found ")
        if (new Date()>otpRecord.expiresAt) 
         {
            throw new BadRequestException("OTP is expired!")
        }    
        const matchedOtp = await bcrypt.compare(otp.toString(), otpRecord.otp)

        if (!matchedOtp) throw new UnauthorizedException("Invalid Otp")

        if (matchedOtp) {
            await  this.otpRep.delete(otpRecord)
        }    

        return matchedOtp;


    }


}

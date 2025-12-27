import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { SignUpDto } from './dto/signUp.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RTGuard } from './guards/rt.guard';
import { response, type Response } from 'express';
import { OtpDto } from './dto/otp.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    // @ApiResponse({ status: 200, description: "Signed Up successfully" })
    // @ApiResponse({ status: 400, description: "Bad Request" })
    // @Post('sign-up')
    // async signUp(@Body() signUpDto: SignUpDto) {
    //     return this.authService.signUp(signUpDto);
    // }

    // will use local guard when not return auth service logged in method 
    @ApiResponse({ status: 200, description: "logged in successfully" })
    @Post('sign-in')
    async signIn(@Body() signInDto: SignInDto) {
        return await this.authService.signIn(signInDto);


    }


    @Post('verify-otp')
    async verifyOtp(@Body() otpDto: OtpDto, @Res({ passthrough: true }) res: Response, @Req() req: any) {

        const response = await this.authService.verifyOtpAndLogin(otpDto.email, Number(otpDto.otp))

        res.cookie('access_token', response.tokens.access_token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in production
            sameSite: 'lax',
            path: '/', // <--- THIS IS CRITICAL
        });

        // Do the same for refresh_token
        res.cookie('refresh_token', response.tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/', // Change this from '/auth' to '/'
        });
        // res.cookie('refresh_token', response.tokens.refresh_token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'lax',
        //     path: '/auth',
        // });
        return { access_token: response.tokens.access_token, user: {
            email:response.user.email,
            role:response.user.userType,
            
        } };


    }


    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        const user = req.user;
        res.clearCookie('refresh_token', { path: '/' });
         res.clearCookie('access_token', { path: '/' });
        return this.authService.logout(user.sub)
    }



    @UseGuards(RTGuard)
    @Post('refresh-token')
    async refreshToken(@Req() req, @Res({ passthrough: true }) res: Response) {
        const { sub: userId, refreshToken } = req.user

        const tokens = await this.authService.refreshTokens(userId, refreshToken)

        res.cookie('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        return { access_token: tokens.access_token };
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    profile(@Req() req) {
        return req.user;
    }





}

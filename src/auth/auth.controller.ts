

import { Body, Controller, Get, Post, Req, Res, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RTGuard } from './guards/rt.guard';
import { response, type Response } from 'express';
import { OtpDto } from './dto/otp.dto';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) { }

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
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Req() req) {
    }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Req() req, @Res() res: Response) {
        const result = await this.authService.googleLogin(req , res);
        const frontendUrl = this.configService.get("REDIRECT_FRONTEND_URL"); 
        
           // Construct the URL with user data in query params
    const redirectUrl = new URL(frontendUrl);
    redirectUrl.pathname = '/login-success'; // Set the path dynamically
    

    redirectUrl.searchParams.append('email', result.user.email);
    redirectUrl.searchParams.append('name', req.user.name); 
    redirectUrl.searchParams.append('role', result.user.userType);

    // Redirect to the frontend page you showed in the image
    return res.redirect(redirectUrl.toString());
    }


    @Post('verify-otp')
    async verifyOtp(@Body(ValidationPipe) otpDto: OtpDto, @Res({ passthrough: true }) res: Response, @Req() req: any) {

        const response = await this.authService.verifyOtpAndLogin(otpDto.email, Number(otpDto.otp), res)
        return {
            user: {
                email: response.user.email,
                role: response.user.userType,

            }
        };


    }


     @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
        const user = req.user;
        return this.authService.logout(user.sub,res)
    }



    @UseGuards(RTGuard)
    @Post('refresh-token')
    async refreshToken(@Req() req, @Res({ passthrough: true }) res: Response) {
        const { sub: userId, refreshToken } = req.user
        const tokens = await this.authService.refreshTokens(userId, refreshToken , res)
        return { access_token: tokens.access_token };
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    profile(@Req() req) {
        return req.user;
    }





}

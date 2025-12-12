import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { SignUpDto } from './dto/signUp.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RTGuard } from './guards/rt.guard';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService:AuthService){}

    @ApiResponse({status:200 , description:"Signed Up successfully"})
    @ApiResponse({status:400 , description:"Bad Request"})
    @Post('sign-up')
    async signUp(@Body() signUpDto:SignUpDto){
        return this.authService.signUp(signUpDto);
    }

    // will use local guard when not return auth service logged in method 
    @ApiResponse({status:200 , description:"logged in successfully"})
    @Post('sign-in')
    async signIn(@Body() signInDto:SignInDto, @Res({ passthrough: true }) res: Response){
        const tokens = await this.authService.signIn(signInDto);

        res.cookie('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/auth',
        });

        return { access_token: tokens.access_token };
    }


    @UseGuards(JwtAuthGuard)
    @Post()
    async logout(@Req() req:any ){
        const user= req.user;
        return this.authService.logout(user.sub)
    }


    @UseGuards(RTGuard)
    @Post('refresh-token')
    async refreshToken(@Req() req, @Res({ passthrough: true }) res: Response){
        const {sub:userId, refreshToken}= req.user

        const tokens = await this.authService.refreshTokens(userId,refreshToken)

        res.cookie('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/auth',
        });

        return { access_token: tokens.access_token };
    }



    
}

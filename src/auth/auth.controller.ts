import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { SignUpDto } from './dto/signUp.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RTGuard } from './guards/rt.guard';

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
    async signIn(@Body() signInDto:SignInDto){
        return this.authService.signIn(signInDto)
    }


    @UseGuards(JwtAuthGuard)
    @Post()
    async logout(@Req() req:any ){
        const user= req.user;
        return this.authService.logout(user.sub)
    }


    @UseGuards(RTGuard)
    @Post('refresh-token')
    async refreshToken(@Req() req){
        const {sub:userId, refreshToken}= req.user

        return this.authService.refreshTokens(userId,refreshToken)
    }



    
}

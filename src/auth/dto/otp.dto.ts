import { IsEmail, IsNumber } from "class-validator";

export class OtpDto{

    @IsEmail()
    email:string

    @IsNumber()
    otp:number


}
import { Transform } from "class-transformer";
import { IsEmail, IsNumber, Length, Min } from "class-validator";

export class OtpDto{

    @Length(5,30,{message:"Email should be atleast 5 characters long"})
    email:string

    @Transform(({value})=>(Number
        (value)
    ))
    @IsNumber()
    otp:number


}
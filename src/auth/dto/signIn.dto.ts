import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength } from "class-validator";

export class SignInDto {

    @ApiProperty({example:"abc@example.com"})
    @IsEmail()
    email:string;
    
    @MinLength(6 , {message:"Password must be at least 6 characters long"})
    @ApiProperty({example:"Abc1234"})
    password:string;
}

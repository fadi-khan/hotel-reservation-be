import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength } from "class-validator";
import { UserType } from "src/enums/UserType";

export class SignUpDto {
 
    @ApiProperty({example:"abc@example.com"})
    @IsEmail()
    email:string;
    
    @MinLength(6 , {message:"Password must be at least 6 characters long"})
    @ApiProperty({example:"Abc1234"})
    password:string;

    @ApiProperty({example:"abc"})
    @MinLength(3, {message:"Name must be at least 3 characters long"})
    name?:string;

    @ApiProperty({example:"GUEST"})
    userType?:UserType;
}

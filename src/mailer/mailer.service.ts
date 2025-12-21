import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { console } from 'inspector';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {

    constructor (private  confiService:ConfigService ){}
    
    private async  getTransporter() {
        return  nodemailer.createTransport({
             service: this.confiService.get('EMAIL_SERVICE'),
             auth:{
                user:this.confiService.get('SENDER_EMAIL'),
                pass:this.confiService.get('MAILER_SECRET')
             }   


        })
    }

    async sendOtp(email:string , otp:string) {
        const transporter  = await this.getTransporter();
        const data = await transporter.sendMail({
            to:email,
            subject:"Luminous Hotels Otp Code.",
            from:this.confiService.get('SENDER_EMAIL'),
            text:`Your otp code is ${otp}. It expires in 5 minutes.`,
            

        })
        console.log("sending data", data)
    }

}

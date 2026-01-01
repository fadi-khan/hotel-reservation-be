import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RTStrategry } from './strategies/rt.strategy';
import { Otp } from 'src/database/entities/otp.entity';
import { MailerModule } from 'src/mailer/mailer.module';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports:[
    PassportModule,
     TypeOrmModule.forFeature([User , Otp]),

    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>({
        secret:configService.get("JWT_SECRET"),
        signOptions:{
          expiresIn:configService.get("JWT_EXPIRES_IN")
        }
      })

    }),
    MailerModule
  ],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy,RTStrategry , GoogleStrategy],
  exports:[AuthService]

})
export class AuthModule {}

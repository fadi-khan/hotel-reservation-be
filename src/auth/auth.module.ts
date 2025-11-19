import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    PassportModule,
    // TypeOrmModule.forFeature([User]),

    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>({
        secret:configService.get("JWT_SECRET"),
        signOptions:{
          expiresIn:configService.get("JWT_EXPIRES_IN")
        }
      })

    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports:[AuthService]

})
export class AuthModule {}

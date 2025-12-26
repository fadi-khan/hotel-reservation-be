import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')), // ensure number
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'), // must be a string
        database: configService.get<string>('DB_DATABASE'),
        dropSchema: false,
        autoLoadEntities: true,
        keepConnectionAlive: true,
        synchronize: true,
        extra: {
          max: Number(configService.get<string>('DB_MAX_POOL_SIZE')) || undefined,
          min: Number(configService.get<string>('DB_MIN_POOL_SIZE')) || undefined,
        },
        entities: [`${__dirname}/entities/**.entity.{js,ts}`],
        ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule { }

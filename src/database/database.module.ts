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
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.username'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.database'),
        dropSchema: false,
        autoLoadEntities: true,
        keepConnectionAlive: true,
        synchronize: false,
        extra: {
          max: configService.get<number>('db.maxPoolSize'),
          min: configService.get<number>('db.minPoolSize'),
        },
        entities: [`${__dirname}/entities/**.entity.{js,ts}`],
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

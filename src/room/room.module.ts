import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/database/entities/room.entity';
import { RoomMapper } from './mappers/room.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  controllers: [RoomController],
  providers: [RoomService],
  exports:[RoomService]
})
export class RoomModule {}

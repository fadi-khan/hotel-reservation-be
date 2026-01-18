import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/database/entities/room.entity';
import { Repository } from 'typeorm';
import { RoomMapper } from './mappers/room.mapper';
import { RoomQueryParamsDto } from './dto/room-query-params.dto';

@Injectable()
export class RoomService {

  constructor(

    @InjectRepository(Room)
    private readonly roomRepo : Repository<Room>
  ){ }

  async create(createRoomDto: CreateRoomDto) {
    
    try {
      await this.roomRepo.save(RoomMapper.toEntity(createRoomDto))
    } 
    catch (error) {
      console.log(error)
       throw new BadRequestException("Failed to save to the room")
    }

  }

  async findAll(query:RoomQueryParamsDto, skip:number, limit?:number ,) {

    const {priceRangeEnd ,priceRangeStart ,bedType ,roomType,status  }  = query
    
    const whereClause: any = {
      ...(status && {status}),
      ...(bedType &&  { bedType}),
      ...(roomType && {roomType})
    };
    
    if (priceRangeStart && priceRangeEnd) {
      whereClause.price = {
        between: [priceRangeStart, priceRangeEnd]
      };
    }
    const response= await this.roomRepo.find({
      where: whereClause,
      take:limit||10,
      skip:skip || 0
      
    })
    if (response.length<1) {
      throw new NotFoundException("Rooms does not exist yet")
    }
    return  response
  }

   async findOne(id: number) {
      try {
        
        return await this.findOne(id)

      } catch (error) {
        throw new NotFoundException('Room not found')
      }
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    try {
       await this.roomRepo.update(id,updateRoomDto)

    } catch (error) {
      throw new BadRequestException("Failed to update the room ")
    }
  }

 async remove(id: number) {
    try {
      await this.roomRepo.delete(id)
    } catch (error) {
       throw new BadRequestException("Room deletion was unsucessfull!")
    }
  }
}

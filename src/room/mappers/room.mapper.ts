import { CreateRoomDto } from "../dto/create-room.dto";
import { Room } from "src/database/entities/room.entity";
import { RoomStatus } from "src/enums/RoomStatus";
import { RoomFacility } from "src/enums/RoomFacility";

export class RoomMapper {
    static toEntity(dto: CreateRoomDto): Room {
        const room = new Room();
        
        room.roomNo = dto.roomNo;
        room.price = dto.price;
        
       
        room.status = dto.status || RoomStatus.INACTIVE;
        room.facilities = dto.facilities || [RoomFacility.TV];
        if (room.discountedPrice) {
             room.discountedPrice = dto.discountedPrice 
        }
        room.bedType = dto.bedType 
        room.roomType = dto.roomType  
        
        
        room.checkInDate = dto.checkInDate ? new Date(dto.checkInDate) : undefined;
        room.checkOutDate = dto.checkOutDate ? new Date(dto.checkOutDate) : undefined;
        
        return room;
    }

    static toDto(entity: Room): CreateRoomDto {
        const dto = new CreateRoomDto();
        
        dto.roomNo = entity.roomNo;
        dto.price = entity.price;
        dto.status = entity.status;
        dto.facilities = entity.facilities;
        dto.discountedPrice = entity.discountedPrice;
        dto.bedType = entity.bedType;  
        dto.roomType = entity.roomType;  
        dto.checkInDate = entity.checkInDate;
        dto.checkOutDate = entity.checkOutDate;
        
        return dto;
    }
}
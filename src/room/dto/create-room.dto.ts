import { IsString, IsNumber, IsOptional, IsEnum, IsArray, IsDateString } from 'class-validator';
import { RoomStatus } from "src/enums/RoomStatus";
import { RoomFacility } from "src/enums/RoomFacility";
import { RoomType } from "src/enums/RoomType";
import { BedType } from "src/enums/BedType";

export class CreateRoomDto {
    @IsString()
    roomNo: string;

    @IsEnum(RoomStatus)
    @IsOptional()
    status?: RoomStatus;

    @IsArray()
    @IsEnum(RoomFacility, { each: true })
    @IsOptional()
    facilities?: RoomFacility[];

    @IsDateString()
    @IsOptional()
    checkInDate?: Date;

    @IsDateString()
    @IsOptional()
    checkOutDate?: Date;

    @IsNumber()
    price: number;

    @IsNumber()
    @IsOptional()
    discountedPrice?: number;

    @IsEnum(BedType)
    bedType: BedType;

    @IsEnum(RoomType)
    roomType: RoomType;
}

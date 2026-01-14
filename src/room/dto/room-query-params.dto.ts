import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { BedType } from "src/enums/BedType";
import { RoomStatus } from "src/enums/RoomStatus";
import { RoomType } from "src/enums/RoomType";

export class RoomQueryParamsDto {

    @IsOptional()
    @IsNumber()
    priceRangeStart?: number;

    @IsOptional()
    @IsNumber()
    priceRangeEnd?: number;

    @IsEnum(RoomStatus)
    @IsOptional()
    status?: RoomStatus;



    @IsEnum(BedType)
    @IsOptional()
    bedType?: BedType;

    @IsEnum(RoomType)
    @IsOptional()
    roomType?: RoomType;


}
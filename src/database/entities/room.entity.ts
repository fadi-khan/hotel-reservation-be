import { Column, Entity } from "typeorm";
import { Base } from "./base.entity";
import { RoomStatus } from "src/enums/RoomStatus";
import { RoomFacility } from "src/enums/RoomFacility";
import { RoomType } from "src/enums/RoomType";
import { BedType } from "src/enums/BedType";
import { IsOptional } from "class-validator";

@Entity("room")
export class Room extends Base{

    @Column()
    roomNo:string

    @Column({
        type:'enum',
        default:RoomStatus.INACTIVE,
        enum:RoomStatus
    })
    status:RoomStatus

    @Column({
        type: 'enum',
        enum: RoomFacility,
        array: true,
        default: [RoomFacility.TV]
    })
    facilities?:RoomFacility[]


    @Column({type:'timestamptz'})
    checkInDate?:Date

    @Column({type:'timestamptz'})
    checkOutDate?:Date

    @Column({nullable:false})
    price:number

    @Column({nullable:true})
    discountedPrice?:number

    @Column({
        type:'enum',
        enum:RoomType,
        default:RoomType.STANDARD
    })
    roomType:RoomType

       @Column({
        type:'enum',
        enum:BedType,
        default:BedType.SINGLE
    })
    bedType:BedType


    



}

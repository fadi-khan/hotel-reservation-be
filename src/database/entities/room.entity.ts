import { Column, Entity } from "typeorm";
import { Base } from "./base.entity";
import { RoomStatus } from "src/enums/RoomStatus";
import { RoomFacility } from "src/enums/RoomFacility";

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

    @Column()
    price:number

    @Column()
    discountedPrice?:number

    



}

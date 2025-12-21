import { Column, CreateDateColumn, Entity, ManyToOne } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";

@Entity("otp")
export class Otp extends Base {

    @Column()
    otp:string

    @Column ( {  type:'timestamp'})
    expiresAt :Date

    @ManyToOne(() => User, (user)=> user.otps)
    user: User;


}
import { Entity, ManyToOne } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";

@Entity("otp")
export class Otp extends Base {

    otp:string

    @ManyToOne(() => User, (user)=> user.otps)
    user: User;


}
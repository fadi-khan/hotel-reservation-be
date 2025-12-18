import { UserType } from "src/enums/UserType";
import { Column, Entity, OneToMany } from "typeorm";
import { Base } from "./base.entity";
import { Otp } from "./otp.entity";

@Entity("users")
export class User extends Base {

    @Column( {default:"Unknown"})
    name?: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserType,
        default: UserType.GUEST
    })
    userType: UserType;

    // hashed refresh token (nullable)
    @Column({type:'text', nullable: true })
    refreshToken: string | null;

    @OneToMany(()=>Otp , (otp)=> otp.user)
    otps:Otp[]
}

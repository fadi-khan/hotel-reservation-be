import { UserType } from "src/enums/UserType";
import { Column, Entity } from "typeorm";
import { Base } from "./base.entity";

@Entity("users")
export class User extends Base {

    @Column()
    name: string;

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
}

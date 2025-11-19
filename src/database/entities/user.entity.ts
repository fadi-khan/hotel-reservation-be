import { UserType } from "src/enums/UserType";
import { BaseEntity, Column, Entity } from "typeorm";

@Entity("users")
export class User  extends BaseEntity{

    @Column()
    name:string;

    @Column({unique:true})
    email:string;

    @Column()
    password:string;

    @Column({default:UserType.GUEST})
    userType:UserType;
}

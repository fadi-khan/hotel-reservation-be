import { Column, PrimaryGeneratedColumn } from "typeorm";

export abstract class Base{

    @PrimaryGeneratedColumn()
    id:number;

    @Column({default:()=>new Date()})
    createdAt:Date;

    @Column({ onUpdate: "CURRENT_TIMESTAMP",default:()=>new Date()})
    updatedAt?:Date;
}
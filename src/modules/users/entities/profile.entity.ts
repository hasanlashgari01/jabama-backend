import {Column, PrimaryGeneratedColumn} from "typeorm";

export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({unique: true, nullable: true})
    email: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({unique: true, nullable: true})
    national_code: string;

    @Column()
    
}

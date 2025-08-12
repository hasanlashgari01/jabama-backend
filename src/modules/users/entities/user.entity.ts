import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Profile } from "./profile.entity";
import { Otp } from "./otp.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ unique: true })
    mobile_number: string;

    @Column({ unique: true })
    email: string;

    @OneToOne(() => Profile, (profile) => profile.user, { nullable: true })
    @JoinColumn()
    profile: Profile;

    @OneToOne(() => Otp, (otp) => otp.user, { nullable: true })
    @JoinColumn()
    otp: Otp;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

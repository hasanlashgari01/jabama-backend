import { Role } from "src/common/enum/user.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Otp } from "./otp.entity";
import { Profile } from "./profile.entity";
import { Stay } from "src/modules/stay/entities/stay.entity";
import { StayReview } from "src/modules/stay/entities/stay-review.entity";
import { StayBooking } from "src/modules/stay/entities/stay-booking.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ unique: true })
  mobile_number: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: "enum", enum: Role, default: Role.USER })
  role: Role;

  @OneToOne(() => Profile, (profile) => profile.user, { nullable: true })
  @JoinColumn()
  profile: Profile;

  @OneToOne(() => Otp, (otp) => otp.user, { nullable: true })
  @JoinColumn()
  otp: Otp;

  @OneToMany(() => Stay, (stay) => stay.host)
  stays: Stay[];

  @OneToMany(() => StayReview, (stayReview) => stayReview.user)
  reviews: StayReview[];

  @OneToMany(() => StayBooking, (stayBooking) => stayBooking.guest)
  bookings: StayBooking[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

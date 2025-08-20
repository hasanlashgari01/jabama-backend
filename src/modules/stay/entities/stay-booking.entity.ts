import { User } from "src/modules/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Stay } from "./stay.entity";
import { StayBookingStatus } from "../enum/stay-booking.enum";

@Entity()
export class StayBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "date" })
  endDate: Date;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: "enum", enum: StayBookingStatus, default: StayBookingStatus.PENDING })
  status: StayBookingStatus;

  @ManyToOne(() => User, (user) => user.bookings)
  guest: User; // مهمان

  @ManyToOne(() => Stay, (stay) => stay.bookings)
  stay: Stay;
}

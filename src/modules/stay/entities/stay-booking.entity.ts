import { IsDate, Min } from "class-validator";
import { User } from "src/modules/users/entities/user.entity";
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PaymentStatus, StayBookingStatus } from "../enum/stay-booking.enum";
import { StayPricing } from "./stay-pricing.entity";
import { Stay } from "./stay.entity";

@Entity()
export class StayBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50, unique: true })
  bookingReference: string;

  @Column({ type: "date" })
  @IsDate()
  startDate: Date;

  @Column({ type: "date" })
  @IsDate()
  endDate: Date;

  @Column({ type: "int", default: 1 })
  numberOfGuests: number;

  @Column({ type: "int", default: 0, nullable: true })
  numberOfChildren?: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  @Min(0)
  totalPrice: number;

  @Column({ type: "enum", enum: StayBookingStatus, default: StayBookingStatus.PENDING })
  status: StayBookingStatus;

  @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.UNPAID })
  paymentStatus: PaymentStatus;

  @Column({ type: "varchar", length: 255, nullable: true })
  cancellationReason?: string;

  @Column({ type: "timestamp", nullable: true })
  cancellationDate?: Date;

  @ManyToMany(() => StayPricing)
  @JoinTable()
  pricings: StayPricing[];

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: "SET NULL" })
  guest: User; // مهمان

  @Index("idx_staybooking_stay")
  @ManyToOne(() => Stay, (stay) => stay.bookings, { onDelete: "CASCADE" })
  stay: Stay;
}

import { User } from "src/modules/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { StayArea, StayStatus, StayType } from "../enum/stay.enum";
import { StayDetails } from "./stay-details.entity";
import { StayPhoto } from "./stay-photo.entity";
import { StayReview } from "./stay-review.entity";
import { StayAmenity } from "./stay-amenity.entity";
import { StayAvailability } from "./stay-availability.entity";
import { StayBooking } from "./stay-booking.entity";
import { StayPricing } from "./stay-pricing.entity";
import { City } from "src/modules/city/entities/city.entity";

@Entity()
export class Stay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, nullable: true })
  slug: string;

  @Column()
  address: string;

  @Column()
  meterage: number;

  @Column({ type: "enum", enum: StayArea })
  area: StayArea;

  @Column({ type: "decimal", precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: "decimal", precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ type: "enum", enum: StayType })
  type: StayType;

  @Column({ type: "enum", enum: StayStatus, default: StayStatus.PENDING })
  status: StayStatus;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "text", nullable: true })
  description_space: string;

  @Column({ type: "text", nullable: true })
  description_shared_space: string;

  @Column({ type: "text", nullable: true })
  description_additional: string;

  @ManyToOne(() => User, (user) => user.stays)
  host: User;

  @Column()
  host_id: number;

  @ManyToOne(() => City, (city) => city.stays, { onDelete: "SET NULL" })
  city: City;

  @Column()
  city_id: number;

  @OneToOne(() => StayDetails, (details) => details.stay)
  details: StayDetails;

  @OneToMany(() => StayPhoto, (photo) => photo.stay, { cascade: true })
  photos: StayPhoto[];

  @OneToMany(() => StayReview, (review) => review.stay, { cascade: true })
  reviews: StayReview[];

  @OneToMany(() => StayAmenity, (stayAmenity) => stayAmenity.amenity, { cascade: true })
  stayAmenities: StayAmenity[];

  @OneToMany(() => StayPricing, (stayPricing) => stayPricing.stay, { cascade: true })
  pricings: StayPricing[]; // قیمت‌ها برای هر روز

  @OneToMany(() => StayAvailability, (stayAvailability) => stayAvailability.stay, { cascade: true })
  availabilities: StayAvailability[]; // تقویم در دسترس بودن

  @OneToMany(() => StayBooking, (stayBooking) => stayBooking.stay, { cascade: true })
  bookings: StayBooking[]; // رزروها

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

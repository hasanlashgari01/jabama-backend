import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Stay } from "./stay.entity";

@Entity()
export class StayAvailability {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date" })
  date: Date; // تاریخ

  @Column({ default: true })
  available: boolean; // در دسترس هست یا نه

  @ManyToOne(() => Stay, (stay) => stay.availabilities)
  stay: Stay;
}

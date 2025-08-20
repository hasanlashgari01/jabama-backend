import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Stay } from "./stay.entity";

@Entity()
export class StayDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: true })
  floor: number; // طبقه اقامتگاه

  @Column({ type: "int", nullable: true })
  stairs: number; // تعداد پله ها

  @Column({ type: "int", default: 1 })
  base_room_capacity: number; // ظرفیت پایه اتاق

  @Column({ type: "int", default: 1 })
  max_capacity: number; // ظرفیت کل اقامتگاه

  @Column({ type: "int", default: 0 })
  rooms: number; // تعداد اتاق ها

  @Column({ type: "int", default: 0 })
  single_beds: number; // تعداد تخت های یک نفره

  @Column({ type: "int", default: 0 })
  double_beds: number; // تعداد تخت های دو نفره

  @Column({ type: "int", default: 0 })
  traditional_beds: number; // تعداد تخت های سنتی

  @Column({ type: "int", default: 0 })
  bathrooms: number; // تعداد حمام

  @Column({ type: "int", default: 0 })
  western_toilets: number; // تعداد سرویس بهداشتی فرنگی

  @Column({ type: "int", default: 0 })
  iranian_toilets: number; // تعداد سرویس بهداشتی ایرانی

  @Column({ type: "int", default: 0 })
  parking_spaces: number; // تعداد پارکینگ

  @OneToOne(() => Stay, (stay) => stay.details, { onDelete: "CASCADE" })
  @JoinColumn()
  stay: Stay;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

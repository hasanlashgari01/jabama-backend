import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Stay } from "./stay.entity";

@Entity()
export class StayPricing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date" })
  date: Date; // تاریخ (برای قیمت روزانه)

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number; // قیمت به تومان یا هر واحد

  @ManyToOne(() => Stay, (stay) => stay.pricings)
  stay: Stay;
}

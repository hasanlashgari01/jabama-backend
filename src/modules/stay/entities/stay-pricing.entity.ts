import { Min } from "class-validator";
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Stay } from "./stay.entity";

@Entity()
export class StayPricing {
  @PrimaryGeneratedColumn()
  id: number;

  @Index("idx_staypricing_date")
  @Column({ type: "date" })
  date: Date; // تاریخ (برای قیمت روزانه)

  @Column({ type: "decimal", precision: 10, scale: 2 })
  @Min(0)
  price: number; // قیمت به تومان یا هر واحد

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  discountPrice?: number;

  @Column({ type: "boolean", default: false })
  isSpecialOffer: boolean;

  @ManyToOne(() => Stay, (stay) => stay.pricings, { onDelete: "CASCADE" })
  stay: Stay;
}

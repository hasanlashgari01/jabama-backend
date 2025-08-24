import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Stay } from "./stay.entity";
import { Amenity } from "./amenity.entity";

@Entity()
export class StayAmenity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Stay, (stay) => stay.stayAmenities, { onDelete: "CASCADE" })
  stay: Stay;

  @ManyToOne(() => Amenity, (amenity) => amenity.stayAmenities, { onDelete: "CASCADE" })
  amenity: Amenity;

  @Column({ nullable: true })
  isAvailable: boolean;

  @Column({ type: "int", nullable: true })
  quantity: number;

  @Column({ nullable: true })
  customDescription: string;

  @Column({ default: false })
  isFree: boolean;
}

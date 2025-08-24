import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Amenity } from "./amenity.entity";
import { Stay } from "./stay.entity";

@Entity()
export class StayAmenity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Stay, (stay) => stay.stayAmenities, { onDelete: "CASCADE" })
  @JoinColumn({ name: "stayId" })
  stay: Stay;

  @Column()
  stayId: number;

  @ManyToOne(() => Amenity, (amenity) => amenity.stayAmenities, { onDelete: "CASCADE" })
  @JoinColumn({ name: "amenityId" })
  amenity: Amenity;

  @Column()
  amenityId: number;

  @Column({ nullable: true })
  is_available: boolean;

  @Column({ type: "int", nullable: true })
  quantity: number;

  @Column({ nullable: true })
  custom_description: string;

  @Column({ default: false })
  is_free: boolean;
}

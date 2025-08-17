import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Accommodation } from "./accommodation.entity";

@Entity()
export class AccommodationImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Accommodation, (accommodation) => accommodation.images)
  accommodation: Accommodation;

  @Column()
  accommodationId: number;

  @Column("text")
  image: string;
}

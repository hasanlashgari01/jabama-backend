import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AccommodationImage } from "./accommodation-image.entity";

@Entity()
export class Accommodation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => AccommodationImage, (image) => image.accommodation)
  images: AccommodationImage[];

  @Column()
  location: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @Column()
  description_of_space: string;

  @Column()
  description_tip: string;

  @Column()
  amenities: string[];

  @Column()
  hostId: number;
}

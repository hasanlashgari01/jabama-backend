import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { AmenityCategory } from "./amenity-category.entity";
import { StayAmenity } from "./stay-amenity.entity";

@Entity()
export class Amenity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // نام امکان، مثل 'تلویزیون', 'استخر'

  @Column({ nullable: true })
  description: string; // توضیح اختیاری

  @ManyToOne(() => AmenityCategory, (category) => category.amenities, { nullable: true })
  @JoinColumn({ name: "category_id" })
  category: AmenityCategory;

  @OneToMany(() => StayAmenity, (stayAmenity) => stayAmenity.amenity)
  stayAmenities: StayAmenity[];
}

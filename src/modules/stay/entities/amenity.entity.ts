import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
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
  category: AmenityCategory; // دسته‌بندی این امکان (اختیاری، اگر null باشه بدون دسته)

  @Column()
  category_id: number;

  @OneToMany(() => StayAmenity, (stayAmenity) => stayAmenity.amenity)
  stayAmenities: StayAmenity[];
}

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Amenity } from "./amenity.entity";

@Entity()
export class AmenityCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // نام دسته، مثل 'امکانات رفاهی', 'امکانات آشپزخانه'

  @Column({ nullable: true })
  description: string; // توضیح اختیاری برای دسته

  @OneToMany(() => Amenity, (amenity) => amenity.category)
  amenities: Amenity[]; // لیست امکانات این دسته
}

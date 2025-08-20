import { Province } from "src/modules/province/entities/province.entity";
import { Stay } from "src/modules/stay/entities/stay.entity";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class City {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column()
  name_en: string;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 180 })
  slug: string;

  @Column({ type: "decimal", precision: 10, scale: 6, nullable: true })
  latitude: number | null;

  @Column({ type: "decimal", precision: 10, scale: 6, nullable: true })
  longitude: number | null;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @ManyToOne(() => Province, (p) => p.cities, { onDelete: "SET NULL" })
  province: Province;

  @Column({ type: "int" })
  province_id: number;

  @OneToMany(() => Stay, (stay) => stay.city)
  @JoinColumn({ name: "city_id" })
  stays: Stay[];
}

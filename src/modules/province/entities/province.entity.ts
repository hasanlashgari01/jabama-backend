import { City } from "src/modules/city/entities/city.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Province {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Index()
  @Column({ type: "varchar", length: 100 })
  name: string;

  @Index()
  @Column({ type: "varchar", length: 100, nullable: true })
  name_en: string | null;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 150 })
  slug: string;

  @OneToMany(() => City, (city) => city.province)
  cities: City[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

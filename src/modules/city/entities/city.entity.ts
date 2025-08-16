import { Province } from "src/modules/province/entities/province.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

  @ManyToOne(() => Province, (p) => p.cities, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "province_id" })
  province?: Province | null;

  @Column({ type: "int", nullable: true })
  province_id?: number | null;

  @Column({ type: "decimal", precision: 10, scale: 6, nullable: true })
  lat: number | null;

  @Column({ type: "decimal", precision: 10, scale: 6, nullable: true })
  lng: number | null;

  @Column({ type: "boolean", default: true })
  is_active: boolean;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Stay } from "./stay.entity";

@Entity()
export class StayPhoto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  key: string;

  @Column({ default: false })
  is_main: boolean;

  @ManyToOne(() => Stay, (stay) => stay.photos, { onDelete: "CASCADE" })
  stay: Stay;

  @Column()
  stay_id: number;
}

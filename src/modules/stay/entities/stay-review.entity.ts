import { User } from "src/modules/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Stay } from "./stay.entity";

@Entity()
export class StayReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", default: 5 })
  rating: number;

  @Column({ type: "text", nullable: true })
  comment: string;

  @ManyToOne(() => Stay, (stay) => stay.reviews, { onDelete: "CASCADE" })
  stay: Stay;

  @Column()
  stay_id: number;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

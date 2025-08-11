import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Otp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ length: 4 })
  code: string;

  @Column()
  expiry_date: Date;

  @Column()
  is_used: boolean;

  @Column()
  userId: number;
  @OneToOne(() => User, (user) => user.otp, { onDelete: "CASCADE" })
  user: User;
}

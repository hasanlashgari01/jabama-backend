import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Gender } from "../enum/user.enum";
import { User } from "./user.entity";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  national_code: string;

  @Column({ type: "enum", enum: Gender, default: null })
  gender: Gender | null;

  @Column({ type: "date", nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  bio: string;

  @Column()
  userId: number;
  @OneToOne(() => User, (user) => user.profile, { onDelete: "CASCADE" })
  user: User;
}

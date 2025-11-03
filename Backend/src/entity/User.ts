import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

export type UserRole = 'admin' | 'user' | 'master';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column()
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'varchar', default: 'user' })
  role!: UserRole;
}
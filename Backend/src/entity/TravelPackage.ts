import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type PackageType = 'nacional' | 'internacional';

@Entity()
export class TravelPackage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  preco!: string;

  @Column()
  descricao!: string;

  @Column({ nullable: true })
  imagem?: string;

  @Column({ type: 'varchar' })
  tipo!: PackageType;
}
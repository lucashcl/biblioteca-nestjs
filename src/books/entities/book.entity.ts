import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Copy } from '../../copies/entities/copy.entity';

@Entity({
  name: 'books',
  orderBy: {
    updatedAt: 'DESC',
  },
})
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Index()
  @Column()
  author: string;

  @Column({ unique: true })
  isbn: string;

  @OneToMany(() => Copy, (copy) => copy.book)
  copies: Copy[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}

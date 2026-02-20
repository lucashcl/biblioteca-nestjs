import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';

const copyEnum = ['available', 'borrowed', 'lost'] as const;

type CopyStatus = (typeof copyEnum)[number];

@Entity({
  name: 'copies',
  orderBy: {
    updatedAt: 'DESC',
  },
})
export class Copy {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, (book) => book.copies)
  @Index()
  book: Book;

  @Column({
    enum: copyEnum,
  })
  @Index()
  status: CopyStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}

import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';

type CopyStatus = (typeof Copy.status)[number];

@Entity({
  name: 'copies',
  orderBy: {
    updatedAt: 'DESC',
  },
})
export class Copy {
  public static readonly status = [
    'available',
    'borrowed',
    'reserved',
  ] as const;
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, (book) => book.copies)
  @Index()
  book: Book;

  @Column({
    enum: Copy.status,
  })
  @Index()
  status: CopyStatus;

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

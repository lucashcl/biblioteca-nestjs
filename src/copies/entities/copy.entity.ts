import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Book } from '../../books/entities/book.entity';
import { Loan } from '../../loans/entities/loan.entity';

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

  @Column({
    enum: Copy.status,
  })
  @Index()
  status: CopyStatus;

  @ManyToOne(() => Book, (book) => book.copies)
  @Index()
  book: Book;

  @OneToMany(() => Loan, (loan) => loan.copy)
  loans: Loan[];

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

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Copy } from '../../copies/entities/copy.entity';
import { Reader } from '../../readers/entities/reader.entity';

@Entity({
  name: 'loans',
  orderBy: {
    updatedAt: 'DESC',
  },
})
export class Loan {
  public static readonly status = ['active', 'overdue', 'returned'] as const;
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Copy, (copy) => copy.loans)
  copy: Copy;

  @ManyToOne(() => Reader, (reader) => reader.loans)
  reader: Reader;

  @Column({ type: 'timestamp' })
  loanedAt: Date;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnedAt: Date | null = null;

  getStatus(now: Date = new Date()): (typeof Loan.status)[number] {
    if (this.returnedAt) {
      return 'returned';
    }
    if (this.dueDate < now) {
      return 'overdue';
    }
    return 'active';
  }

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

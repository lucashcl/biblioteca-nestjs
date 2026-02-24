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
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Copy, (copy) => copy.loans)
  copy: Copy;

  @ManyToOne(() => Reader, (reader) => reader.loans)
  reader: Reader;

  @Column({ type: 'date' })
  loanedAt: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'date', nullable: true })
  returnedAt: Date | null = null;

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

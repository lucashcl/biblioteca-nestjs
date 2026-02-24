import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Loan } from '../../loans/entities/loan.entity';

type ReaderStatus = (typeof Reader.status)[number];

@Entity({
  name: 'readers',
  orderBy: {
    updatedAt: 'DESC',
  },
})
export class Reader {
  public static readonly status = ['active', 'suspended'] as const;
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  address: string;

  @Column({ enum: Reader.status, default: 'active' })
  status: ReaderStatus;

  @OneToMany(() => Loan, (loan) => loan.reader)
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

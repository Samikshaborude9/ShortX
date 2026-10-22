import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UrlClick } from '../../analytics/entities/url-click.entity';

@Entity('urls')
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ name: 'original_url', type: 'text' })
  originalUrl: string;

  @Index({ unique: true })
  @Column({ name: 'short_code', unique: true, length: 20 })
  shortCode: string;

  @Index({ unique: true })
  @Column({ name: 'custom_alias', unique: true, nullable: true, length: 100 })
  customAlias: string;

  @Index()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'expires_at', nullable: true, type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user.urls, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => UrlClick, (click) => click.url)
  clicks: UrlClick[];
}
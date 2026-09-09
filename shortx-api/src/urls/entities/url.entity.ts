import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { UrlClick } from '../../analytics/entities/url-click.entity';

@Entity('urls')
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ name: 'original_url', type: 'text' })
  originalUrl: string;

  @Column({ name: 'short_code', unique: true, length: 20 })
  shortCode: string;

  @Column({ name: 'custom_alias', unique: true, nullable: true, length: 100 })
  customAlias: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'expires_at', nullable: true, type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.urls, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => UrlClick, (click) => click.url)
  clicks: UrlClick[];
}
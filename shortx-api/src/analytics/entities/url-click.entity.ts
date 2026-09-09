import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Url } from '../../urls/entities/url.entity';

@Entity('url_clicks')
export class UrlClick {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'url_id' })
  urlId: string;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @Column({ nullable: true, type: 'text' })
  referrer: string;

  @Column({ nullable: true, length: 10 })
  country: string;

  @Column({ nullable: true, length: 50 })
  browser: string;

  @Column({ nullable: true, length: 50 })
  device: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Url, (url) => url.clicks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'url_id' })
  url: Url;
}
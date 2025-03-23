import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.users, {
    nullable: false,
    eager: true,
  })
  tenant: Tenant;

  @ManyToMany(() => Task, (task) => task.assignedUsers)
  @JoinTable()
  tasks: Task[];
}

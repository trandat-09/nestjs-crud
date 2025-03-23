import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @ManyToOne(() => Task, (task) => task.subtasks, { nullable: true })
  parent: Task;

  @Column({ nullable: true })
  parentId: number;

  @OneToMany(() => Task, (task) => task.parent)
  subtasks: Task[];

  @ManyToOne(() => Tenant, (tenant) => tenant.tasks, {
    nullable: false,
    eager: false,
  })
  tenant: Tenant;

  @ManyToMany(() => User, (user) => user.tasks)
  assignedUsers: User[];
}

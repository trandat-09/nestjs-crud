import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Task } from '../src/tasks/entities/task.entity';
import { Tenant } from '../src/tenants/entities/tenant.entity';
import { User } from '../src/auth/entities/user.entity';

export const testDbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  entities: [Task, Tenant, User],
  synchronize: true,
};

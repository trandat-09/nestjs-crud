import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TenantsService } from '../tenants/tenants.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private tenantsService: TenantsService,
  ) {}

  async createTask(
    createTaskDto: CreateTaskDto,
    tenantId: number,
  ): Promise<Task> {
    const tenant = await this.tenantsService.findOne(tenantId);

    const task = this.taskRepository.create({
      ...createTaskDto,
      tenant,
    });

    return await this.taskRepository.save(task);
  }

  async getTasks(tenantId: number): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { tenant: { id: tenantId } },
      relations: ['assignedUsers', 'tenant'],
    });
  }

  async getTaskById(id: number, tenantId: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, tenant: { id: tenantId } },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async updateTask(
    id: number,
    tenantId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.getTaskById(id, tenantId);

    if (updateTaskDto.parentId) {
      const parentTask = await this.getTaskById(
        updateTaskDto.parentId,
        tenantId,
      );

      if (!parentTask) {
        throw new NotFoundException(
          `Parent task with ID ${updateTaskDto.parentId} not found`,
        );
      }

      if (parentTask.parentId === task.id) {
        throw new ForbiddenException('Task cannot be a parent of its parent');
      }

      if (parentTask.id === task.id) {
        throw new ForbiddenException('Task cannot be a parent of itself');
      }
    }

    const updatedTask = this.taskRepository.merge(task, updateTaskDto);

    return await this.taskRepository.save(updatedTask);
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async getSubTasks(taskId: number, tenantId: number): Promise<Task[]> {
    const task = await this.getTaskById(taskId, tenantId);
    return await this.taskRepository.find({ where: { parentId: task.id } });
  }
}

import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TenantId } from '../common/decorators/user.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @Roles('admin')
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @TenantId() tenantId: number,
  ) {
    return this.tasksService.createTask(createTaskDto, tenantId);
  }

  @Get()
  getTasks(@TenantId() tenantId: number) {
    return this.tasksService.getTasks(tenantId);
  }

  @Get(':id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @TenantId() tenantId: number,
  ) {
    return this.tasksService.getTaskById(id, tenantId);
  }

  @Get(':id/subtasks')
  getSubtasks(
    @Param('id', ParseIntPipe) id: number,
    @TenantId() tenantId: number,
  ) {
    return this.tasksService.getSubTasks(id, tenantId);
  }

  @Put(':id')
  @Roles('admin')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @TenantId() tenantId: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.updateTask(id, tenantId, updateTaskDto);
  }

  @Delete(':id')
  @Roles('admin')
  deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.deleteTask(id);
  }
}

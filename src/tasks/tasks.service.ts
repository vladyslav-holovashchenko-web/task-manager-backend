import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User) {
    const task = this.tasksRepository.create(createTaskDto);
    task.user = user;
    return this.tasksRepository.save(task);
  }

  async findAll(id: number) {
    const tasks = await this.tasksRepository.find({
      where: { user: { id } },
    });

    return tasks;
  }

  async findOne(id: string, user: User) {
    const task = await this.tasksRepository.findOneBy({ id, user });
    if (!task)
      throw new NotFoundException(
        'Task not found or does not belong to the user',
      );
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: User) {
    const task = await this.tasksRepository.findOneBy({ id, user });
    if (!task)
      throw new NotFoundException(
        'Task not found or does not belong to the user',
      );
    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async remove(id: string, user: User) {
    const task = await this.tasksRepository.findOneBy({
      id,
      user,
    });
    if (!task)
      throw new NotFoundException(
        'Task not found or does not belong to the user',
      );
    return this.tasksRepository.remove(task);
  }
}

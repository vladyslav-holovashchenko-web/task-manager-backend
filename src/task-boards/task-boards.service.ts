import { Injectable } from '@nestjs/common';
import { CreateTaskBoardDto } from './dto/create-task-board.dto';
import { UpdateTaskBoardDto } from './dto/update-task-board.dto';
import { TaskBoard } from './entities/task-board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TaskBoardsService {
  constructor(
    @InjectRepository(TaskBoard)
    private tasksBoardRepository: Repository<TaskBoard>,
  ) {}
  create(createTaskBoardDto: CreateTaskBoardDto) {
    return this.tasksBoardRepository.create(createTaskBoardDto);
  }

  findAll() {
    return this.tasksBoardRepository.find();
  }

  findOne(id: string) {
    return this.tasksBoardRepository.findOneBy({ id });
  }

  update(id: string, updateTaskBoardDto: UpdateTaskBoardDto) {
    return this.tasksBoardRepository.update(id, updateTaskBoardDto);
  }

  remove(id: string) {
    return this.tasksBoardRepository.delete({ id });
  }
}

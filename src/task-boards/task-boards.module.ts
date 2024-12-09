import { Module } from '@nestjs/common';
import { TaskBoardsService } from './task-boards.service';
import { TaskBoardsController } from './task-boards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskBoard } from './entities/task-board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskBoard])],
  controllers: [TaskBoardsController],
  providers: [TaskBoardsService],
})
export class TaskBoardsModule {}

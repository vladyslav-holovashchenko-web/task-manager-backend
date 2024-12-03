import { Request } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
export interface AuthReq extends Request {
  user: User;
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: AuthReq) {
    return this.tasksService.create(createTaskDto, req.user);
  }

  @Get()
  findAll(@Req() req: AuthReq) {
    const user = req.user;
    return this.tasksService.findAll(+user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: AuthReq) {
    return this.tasksService.findOne(+id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: AuthReq,
  ) {
    return this.tasksService.update(+id, updateTaskDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthReq) {
    return this.tasksService.remove(+id, req.user);
  }
}

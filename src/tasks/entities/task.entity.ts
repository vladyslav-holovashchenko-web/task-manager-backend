import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TaskBoard } from '../../task-boards/entities/task-board.entity';
import { Team } from '../../teams/entities/team.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => TaskBoard, (taskBoard) => taskBoard.tasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'boardId' })
  taskBoard: TaskBoard;

  @ManyToOne(() => Team, (team) => team.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: Team;
}

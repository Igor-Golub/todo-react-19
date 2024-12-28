import { use } from "react";
import { Task } from "../model";
import { TaskCard } from "./task-card.tsx";
import { PaginatedResponse } from "../../../shared/types.ts";

interface TaskListProps {
  refetchTasks: VoidFunction;
  tasksPromise: Promise<PaginatedResponse<Task>>;
}

export function TaskList({ tasksPromise, refetchTasks }: TaskListProps) {
  const tasks = use(tasksPromise);

  return (
    <div className="flex gap-2 flex-col">
      {tasks.data.map((task) => (
        <TaskCard key={task.id} task={task} refetchTasks={refetchTasks} />
      ))}
    </div>
  );
}

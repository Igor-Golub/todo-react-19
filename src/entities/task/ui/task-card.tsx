import { useActionState } from "react";
import { Task, deleteTaskAction } from "../model";

interface TaskCardProps {
  task: Task;
  refetchTasks: VoidFunction;
}

export function TaskCard({ task, refetchTasks }: TaskCardProps) {
  const [state, dispatch, isPending] = useActionState(
    deleteTaskAction({ refetchTasks }),
    {},
  );

  return (
    <div className="flex gap-2 w-1">
      <div className="border py-2 px-4 bg-green-100">{task.title}</div>

      <form action={dispatch}>
        <input type="hidden" name="id" value={task.id} />

        <button
          disabled={isPending}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
        >
          Remove
        </button>

        {state.error && <p>Error</p>}
      </form>
    </div>
  );
}

import { useActionState } from "react";
import { createTaskAction } from "../model";

interface CreateTaskFormProps {
  userId: string;
  refetchTasks: VoidFunction;
}

export function CreateTaskForm({ refetchTasks, userId }: CreateTaskFormProps) {
  const [state, dispatch, isPending] = useActionState(
    createTaskAction({ refetchTasks, userId }),
    {
      enteredTitle: "",
    },
  );

  return (
    <form className="flex gap-2" action={dispatch}>
      <input
        type="text"
        name="title"
        disabled={isPending}
        className="border p-2 rounded"
        defaultValue={state.enteredTitle}
      />

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
      >
        Add
      </button>

      {state.error && <p>Error</p>}
    </form>
  );
}

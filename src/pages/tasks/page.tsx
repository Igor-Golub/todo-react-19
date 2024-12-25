import { fetchTasks, PaginatedResponse, Task } from "../../shared/api.ts";
import { startTransition, Suspense, use, useActionState, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router-dom";
import { createTaskAction, deleteTaskAction } from "./actions.ts";

export function TasksPage() {
  const { userId = '' } = useParams<{ userId: string }>()

  const [tasksPromise, setTasksPromise] = useState(() => fetchTasks({ filters: { userId } }))

  const refetchTasks = () => startTransition(async () => {
      setTasksPromise(fetchTasks({
        filters: { userId }
      }))
    }
  )


  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className='text-3xl font-bold underline'>Tasks user {userId}</h1>

      <CreateTaskForm userId={userId} refetchTasks={refetchTasks}/>

      <ErrorBoundary fallback={<div className='text-red-500'>Error</div>}>
        <Suspense fallback={<>Loading</>}>
          <TaskList tasksPromise={tasksPromise} refetchTasks={refetchTasks} />
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}

interface CreateTaskFormProps {
  userId: string;
  refetchTasks: VoidFunction;
}

export function CreateTaskForm({ refetchTasks, userId }: CreateTaskFormProps) {
  const [state, dispatch, isPending] = useActionState(createTaskAction({ refetchTasks, userId }), {
    enteredTitle: ''
  })

  return (
    <form className='flex gap-2' action={dispatch}>
      <input
        type='text'
        name='title'
        disabled={isPending}
        className='border p-2 rounded'
        defaultValue={state.enteredTitle}
      />

      <button
        type="submit"
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500'
      >
        Add
      </button>

      {state.error && <p>Error</p>}
    </form>
  )
}

interface TaskListProps {
  refetchTasks: VoidFunction;
  tasksPromise: Promise<PaginatedResponse<Task>>,
}

export function TaskList({ tasksPromise, refetchTasks }: TaskListProps) {
  const tasks = use(tasksPromise)

  return <div className='flex flex-col'>
    {tasks.data.map((task) => (
      <TaskCard key={task.id} task={task} refetchTasks={refetchTasks} />
    ))}
  </div>
}

interface TaskCardProps {
  task: Task;
  refetchTasks: VoidFunction;
}

export function TaskCard({ task, refetchTasks }: TaskCardProps) {
  const [state, dispatch, isPending] = useActionState(deleteTaskAction({ refetchTasks }), {})

  return (
    <div className='flex gap-2 w-1'>
      <div className='border py-2 px-4 bg-green-100'>
        {task.title}
      </div>

      <form action={dispatch}>
        <input type='hidden' name='id' value={task.id}/>

        <button
          disabled={isPending}
          className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500'
        >
          Remove
        </button>

        {state.error && <p>Error</p>}
      </form>
    </div>
  )
}

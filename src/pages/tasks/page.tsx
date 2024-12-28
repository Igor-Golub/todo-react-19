import { startTransition, Suspense, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { UserPreview } from "../../entities/user";
import { CreateTaskForm, fetchTasks, TaskList } from "../../entities/task";

export function TasksPage() {
  const { userId = "" } = useParams<{ userId: string }>();

  const [tasksPromise, setTasksPromise] = useState(() =>
    fetchTasks({ filters: { userId } }),
  );

  const refetchTasks = () =>
    startTransition(async () =>
      setTasksPromise(
        fetchTasks({
          filters: { userId },
        }),
      ),
    );

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">
        Tasks <UserPreview userId={userId} />
      </h1>

      <CreateTaskForm userId={userId} refetchTasks={refetchTasks} />

      <ErrorBoundary fallback={<div className="text-red-500">Error</div>}>
        <Suspense fallback={<>Loading</>}>
          <TaskList tasksPromise={tasksPromise} refetchTasks={refetchTasks} />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

import { startTransition, Suspense, useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { UserPreview } from "@entities/user";
import {
  CreateTaskForm,
  fetchTasks,
  Pagination,
  TaskList,
  TasksFiltersPanel,
} from "@entities/task";

export function TasksPage() {
  const { userId = "" } = useParams<{ userId: string }>();

  const [tasksPromise, setTasksPromise] = useState(() =>
    fetchTasks({ filters: { userId } }),
  );

  const refetchTasks = () =>
    startTransition(async () => {
      const { page } = await tasksPromise;
      setTasksPromise(fetchTasks({ page, filters: { userId } }));
    });

  const handlePageChange = (page: number) => {
    setTasksPromise(fetchTasks({ page, filters: { userId } }));
  };

  const handleSearchChange = (searchValue: string) => {
    setTasksPromise(fetchTasks({ filters: { title: searchValue, userId } }));
  };

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">
        Tasks <UserPreview userId={userId} />
      </h1>

      <TasksFiltersPanel onSearchChanged={handleSearchChange} />

      <CreateTaskForm userId={userId} refetchTasks={refetchTasks} />

      <ErrorBoundary fallback={<div className="text-red-500">Error</div>}>
        <Suspense fallback={<>Loading</>}>
          <TaskList tasksPromise={tasksPromise} refetchTasks={refetchTasks} />
          <Pagination
            tasksPaginated={tasksPromise}
            onPageChange={handlePageChange}
          />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

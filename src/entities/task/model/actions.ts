import { createTask, deleteTask } from "../api";

interface CreateTaskActionState {
  enteredTitle: string;
  error?: string;
}

export type CreateTaskAction = (
  state: CreateTaskActionState,
  formData: FormData,
) => Promise<CreateTaskActionState>;

interface CreateTaskActionPayload {
  userId: string;
  refetchTasks: VoidFunction;
}

export const createTaskAction =
  ({ refetchTasks, userId }: CreateTaskActionPayload): CreateTaskAction =>
  async (_, formData) => {
    const title = formData.get("title") as string;

    try {
      await createTask({
        id: crypto.randomUUID(),
        title,
        userId,
        done: false,
        createdAt: Date.now(),
      });

      refetchTasks();

      return {
        enteredTitle: "",
      };
    } catch (error) {
      console.error("createTaskAction", error);
      return {
        enteredTitle: title,
        error: "Error while creating Task",
      };
    }
  };

interface DeleteTaskActionState {
  error?: string;
}

export type DeleteTaskAction = (
  state: DeleteTaskActionState,
  formData: FormData,
) => Promise<DeleteTaskActionState>;

interface DeleteTaskActionPayload {
  refetchTasks: VoidFunction;
}

export const deleteTaskAction =
  ({ refetchTasks }: DeleteTaskActionPayload): DeleteTaskAction =>
  async (_, formData) => {
    const id = formData.get("id") as string;

    try {
      await deleteTask(id);
      refetchTasks();

      return {};
    } catch (error) {
      console.error("deleteTaskAction", error);
      return {
        error: "Error while deleting task",
      };
    }
  };
